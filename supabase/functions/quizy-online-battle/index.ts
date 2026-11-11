import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";
import { json, preflight } from "../_shared/http.ts";

type Question = { id: string; q: string; opts: string[]; answer_index: number; exp: string };
type Player = {
  room_id: string;
  player_id: string;
  display_name: string;
  avatar: string;
  score: number;
  active: boolean;
  is_host: boolean;
  player_token: string;
};
type Room = {
  id: string;
  code: string;
  status: string;
  current_round: number;
  total_rounds: number;
  round_resolved: boolean;
  difficulty: string;
  age_band: string;
  questions: Question[];
};

const admin = () =>
  createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", {
    auth: { persistSession: false, autoRefreshToken: false },
  });

function token() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function code() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return [...bytes].map((value) => alphabet[value % alphabet.length]).join("");
}

function shuffle<T>(items: T[]) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [next[index], next[swap]] = [next[swap], next[index]];
  }
  return next;
}

async function deck(db: SupabaseClient, age: string, difficulty: string): Promise<Question[]> {
  const ageBand = age === "old" ? "old" : "young";
  const level = difficulty === "medium" || difficulty === "difficult" ? difficulty : "easy";
  const { data, error } = await db
    .from("quizy_questions")
    .select("id,question,options,answer_index,explanation,word,expires_at,age_band,difficulty")
    .eq("active", true)
    .limit(800);
  if (error) throw new Error(error.message);
  const now = Date.now();
  const usable = (data ?? []).filter((row) => {
    if (row.word) return false;
    if (!Array.isArray(row.options) || row.options.length < 2 || !row.question) return false;
    if (row.expires_at && Date.parse(String(row.expires_at)) < now) return false;
    return true;
  });
  const preferred = usable.filter((row) => row.age_band === ageBand && row.difficulty === level);
  const pool = preferred.length >= 10 ? preferred : usable;
  return shuffle(pool)
    .slice(0, 10)
    .map((row) => ({
      id: String(row.id),
      q: String(row.question),
      opts: (row.options as unknown[]).map(String),
      answer_index: Number(row.answer_index) || 0,
      exp: String(row.explanation ?? ""),
    }));
}

async function roomBy(db: SupabaseClient, column: "id" | "code", value: string) {
  const { data, error } = await db.from("quizy_battle_rooms").select("*").eq(column, value).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Room | null) ?? null;
}

async function playersOf(db: SupabaseClient, roomId: string) {
  const { data, error } = await db.from("quizy_battle_players").select("*").eq("room_id", roomId);
  if (error) throw new Error(error.message);
  return (data ?? []) as Player[];
}

async function answersOf(db: SupabaseClient, roomId: string, round: number) {
  const { data, error } = await db
    .from("quizy_battle_answers")
    .select("player_id,answer_index,correct")
    .eq("room_id", roomId)
    .eq("round", round);
  if (error) throw new Error(error.message);
  return (data ?? []) as { player_id: string; answer_index: number; correct: boolean }[];
}

function publicState(room: Room, players: Player[], me: Player, answers: { player_id: string; correct: boolean }[]) {
  const active = players.filter((player) => player.active);
  const question = room.questions?.[room.current_round];
  return {
    room_id: room.id,
    code: room.code,
    status: room.status,
    current_round: room.current_round,
    total_rounds: room.total_rounds,
    round_resolved: room.round_resolved,
    players: players
      .filter((player) => player.active)
      .map((player) => ({
        player_id: player.player_id,
        display_name: player.display_name,
        avatar: player.avatar,
        score: player.score,
        active: player.active,
        is_host: player.is_host,
      })),
    me: { player_id: me.player_id, is_host: me.is_host },
    question: question
      ? { id: question.id, q: question.q, opts: question.opts, exp: room.round_resolved ? question.exp : "", icon: "⚔️" }
      : undefined,
    my_submitted: answers.some((answer) => answer.player_id === me.player_id),
    submitted_count: answers.length,
    player_count: active.length,
    results: room.round_resolved ? answers.map((answer) => ({ player_id: answer.player_id, correct: answer.correct })) : [],
  };
}

async function stateFor(db: SupabaseClient, room: Room, me: Player) {
  const players = await playersOf(db, room.id);
  const answers = room.status === "playing" ? await answersOf(db, room.id, room.current_round) : [];
  return publicState(room, players, me, answers);
}

async function requirePlayer(db: SupabaseClient, roomId: string, playerToken: string) {
  if (!roomId || !playerToken) throw new Error("Invalid battle player token.");
  const room = await roomBy(db, "id", roomId);
  if (!room) throw new Error("Invalid battle player token.");
  const players = await playersOf(db, roomId);
  const me = players.find((player) => player.player_token === playerToken && player.active);
  if (!me) throw new Error("Invalid battle player token.");
  return { room, me };
}

Deno.serve(async (req) => {
  const early = preflight(req);
  if (early) return early;
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const action = String(body.action ?? "");
    const db = admin();

    if (action === "create") {
      const playerId = String(body.player_id ?? "").trim();
      if (!playerId) return json({ error: "Missing player id" }, 400);
      const questions = await deck(db, String(body.age ?? "young"), String(body.difficulty ?? "easy"));
      if (questions.length < 2) return json({ error: "Not enough questions for a battle." }, 400);
      const roomCode = code();
      const playerToken = token();
      const { data, error } = await db
        .from("quizy_battle_rooms")
        .insert({
          code: roomCode,
          status: "lobby",
          current_round: 0,
          total_rounds: questions.length,
          round_resolved: false,
          difficulty: String(body.difficulty ?? "easy"),
          age_band: body.age === "old" ? "old" : "young",
          questions,
        })
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      const room = data as Room;
      const { error: playerError } = await db.from("quizy_battle_players").insert({
        room_id: room.id,
        player_id: playerId,
        display_name: String(body.name ?? "Explorer").slice(0, 24) || "Explorer",
        avatar: String(body.avatar ?? "🧒").slice(0, 8) || "🧒",
        score: 0,
        active: true,
        is_host: true,
        player_token: playerToken,
      });
      if (playerError) throw new Error(playerError.message);
      const me = (await playersOf(db, room.id))[0];
      return json({
        room_id: room.id,
        code: room.code,
        player_token: playerToken,
        is_host: true,
        state: await stateFor(db, room, me),
      });
    }

    if (action === "join") {
      const playerId = String(body.player_id ?? "").trim();
      const roomCode = String(body.code ?? "")
        .trim()
        .toUpperCase();
      if (!playerId || !roomCode) return json({ error: "Room code and player id are required." }, 400);
      const room = await roomBy(db, "code", roomCode);
      if (!room || room.status === "finished") return json({ error: "Room not found. Check the code." }, 404);
      if (room.status !== "lobby") return json({ error: "That battle has already started." }, 400);
      const existing = (await playersOf(db, room.id)).find((player) => player.player_id === playerId);
      const playerToken = existing?.player_token || token();
      if (existing) {
        await db.from("quizy_battle_players").update({ active: true, player_token: playerToken }).eq("room_id", room.id).eq("player_id", playerId);
      } else {
        const { error } = await db.from("quizy_battle_players").insert({
          room_id: room.id,
          player_id: playerId,
          display_name: String(body.name ?? "Explorer").slice(0, 24) || "Explorer",
          avatar: String(body.avatar ?? "🧒").slice(0, 8) || "🧒",
          score: 0,
          active: true,
          is_host: false,
          player_token: playerToken,
        });
        if (error) throw new Error(error.message);
      }
      const me = (await playersOf(db, room.id)).find((player) => player.player_id === playerId);
      if (!me) throw new Error("Could not join that room.");
      return json({ room_id: room.id, code: room.code, player_token: playerToken, is_host: me.is_host, state: await stateFor(db, room, me) });
    }

    if (action === "state" || action === "start" || action === "answer" || action === "next" || action === "leave") {
      const found = await requirePlayer(db, String(body.room_id ?? ""), String(body.player_token ?? ""));
      let { room } = found;
      const { me } = found;

      if (action === "leave") {
        await db.from("quizy_battle_players").update({ active: false }).eq("room_id", room.id).eq("player_id", me.player_id);
        return json({ ok: true });
      }

      if (action === "start") {
        if (!me.is_host) return json({ error: "Only the host can start." }, 403);
        const count = (await playersOf(db, room.id)).filter((player) => player.active).length;
        if (count < 2) return json({ error: "Wait for at least one more explorer." }, 400);
        const { data, error } = await db
          .from("quizy_battle_rooms")
          .update({ status: "playing", current_round: 0, round_resolved: false })
          .eq("id", room.id)
          .select("*")
          .single();
        if (error) throw new Error(error.message);
        room = data as Room;
      }

      if (action === "answer") {
        if (room.status !== "playing" || room.round_resolved) return json({ error: "This round is closed." }, 400);
        const round = Number(body.round);
        if (round !== room.current_round) return json({ error: "That round has moved on." }, 400);
        const answerIndex = Number(body.answer_index);
        const question = room.questions[room.current_round];
        if (!question) return json({ error: "This round has no question." }, 400);
        const correct = answerIndex === question.answer_index;
        const { error } = await db.from("quizy_battle_answers").upsert(
          { room_id: room.id, player_id: me.player_id, round, answer_index: answerIndex, correct },
          { onConflict: "room_id,player_id,round" },
        );
        if (error) throw new Error(error.message);
        const active = (await playersOf(db, room.id)).filter((player) => player.active);
        const answers = await answersOf(db, room.id, round);
        if (answers.length >= active.length) {
          for (const answer of answers.filter((item) => item.correct)) {
            const player = active.find((item) => item.player_id === answer.player_id);
            if (!player) continue;
            await db
              .from("quizy_battle_players")
              .update({ score: player.score + 1 })
              .eq("room_id", room.id)
              .eq("player_id", player.player_id);
          }
          const { data, error: resolveError } = await db
            .from("quizy_battle_rooms")
            .update({ round_resolved: true })
            .eq("id", room.id)
            .select("*")
            .single();
          if (resolveError) throw new Error(resolveError.message);
          room = data as Room;
        }
      }

      if (action === "next") {
        if (!me.is_host) return json({ error: "Only the host can continue." }, 403);
        if (!room.round_resolved) return json({ error: "Wait until this round is resolved." }, 400);
        const last = room.current_round + 1 >= room.total_rounds;
        const { data, error } = await db
          .from("quizy_battle_rooms")
          .update(last ? { status: "finished", round_resolved: true } : { current_round: room.current_round + 1, round_resolved: false })
          .eq("id", room.id)
          .select("*")
          .single();
        if (error) throw new Error(error.message);
        room = data as Room;
      }

      const fresh = (await playersOf(db, room.id)).find((player) => player.player_id === me.player_id) ?? me;
      return json({ state: await stateFor(db, room, fresh) });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Battle service unavailable";
    const status = message === "Invalid battle player token." ? 400 : 400;
    return json({ error: message }, status);
  }
});
