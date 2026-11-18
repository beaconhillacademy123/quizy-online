import { useEffect, useState } from "react";
import { battleCall, battlePlayerId, type BattleState } from "@/lib/quiz/cloud";
import { supabase } from "@/lib/quiz/cloud";
import { useQuiz } from "@/lib/quiz/store";

type Bridge = {
  isAvailable: () => boolean;
  host: () => void;
  connect: (address: string) => void;
  pairedDevices: () => string;
};

function bridge(): Bridge | null {
  if (typeof window === "undefined") return null;
  const native = (window as unknown as { QuizyBluetooth?: Bridge }).QuizyBluetooth;
  try {
    return native?.isAvailable() ? native : null;
  } catch {
    return null;
  }
}

const SESSION = "quizyBattleSession";

export function BattleRoom() {
  const name = useQuiz((s) => s.name);
  const age = useQuiz((s) => s.age);
  const difficulty = useQuiz((s) => s.difficulty);
  const [view, setView] = useState<BattleState | null>(null);
  const [token, setToken] = useState("");
  const [roomId, setRoomId] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [devices, setDevices] = useState<{ name: string; address: string }[]>([]);
  const [btNote, setBtNote] = useState("");
  const [shareNote, setShareNote] = useState("");
  const native = bridge();

  useEffect(() => {
    const url = new URL(window.location.href);
    const inviteCode = url.searchParams.get("room");
    if (inviteCode) {
      url.searchParams.delete("room");
      window.history.replaceState({}, "", url.toString());
      void joinRoom(inviteCode);
      return;
    }
    const saved = sessionStorage.getItem(SESSION);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { roomId: string; playerToken: string };
      setRoomId(parsed.roomId);
      setToken(parsed.playerToken);
      battleCall("state", { room_id: parsed.roomId, player_token: parsed.playerToken })
        .then((result) => result.state && setView(result.state))
        .catch(() => sessionStorage.removeItem(SESSION));
    } catch {
      sessionStorage.removeItem(SESSION);
    }
  }, []);

  useEffect(() => {
    if (!roomId || !token || view?.status === "finished" || view?.status === "done") return;
    const pull = () => {
      battleCall("state", { room_id: roomId, player_token: token })
        .then((result) => result.state && setView(result.state))
        .catch((caught: unknown) => setError(caught instanceof Error ? caught.message : "Battle paused"));
    };
    const timer = window.setInterval(pull, 1500);
    const channel = supabase.channel(`battle-${roomId}`);
    channel.on("broadcast", { event: "tick" }, pull);
    channel.on(
      "postgres_changes",
      { event: "*", schema: "public", table: "quizy_battle_players", filter: `room_id=eq.${roomId}` },
      pull,
    );
    channel.subscribe();
    return () => {
      window.clearInterval(timer);
      void supabase.removeChannel(channel);
    };
  }, [roomId, token, view?.status]);

  useEffect(() => {
    const nativeBridge = bridge();
    if (!nativeBridge) return;
    const previous = (window as unknown as { QuizyBluetoothEvent?: (raw: string) => void }).QuizyBluetoothEvent;
    (window as unknown as { QuizyBluetoothEvent?: (raw: string) => void }).QuizyBluetoothEvent = (raw: string) => {
      try {
        const message = JSON.parse(raw) as { event?: string; data?: { message?: string } };
        setBtNote(message.data?.message || message.event || "Bluetooth update");
      } catch {
        setBtNote("Bluetooth update");
      }
    };
    try {
      setDevices(JSON.parse(nativeBridge.pairedDevices()) as { name: string; address: string }[]);
    } catch {
      setDevices([]);
    }
    return () => {
      (window as unknown as { QuizyBluetoothEvent?: (raw: string) => void }).QuizyBluetoothEvent = previous;
    };
  }, []);

  function remember(nextRoom: string, nextToken: string) {
    setRoomId(nextRoom);
    setToken(nextToken);
    sessionStorage.setItem(SESSION, JSON.stringify({ roomId: nextRoom, playerToken: nextToken }));
  }

  function poke(id: string) {
    void supabase.channel(`battle-${id}`).send({ type: "broadcast", event: "tick", payload: {} });
  }

  async function run(task: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await task();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Battle could not continue");
    } finally {
      setBusy(false);
    }
  }

  async function joinRoom(roomCode: string) {
    await run(async () => {
      const result = await battleCall("join", {
        code: roomCode.trim().toUpperCase(),
        name: name || "Explorer",
        avatar: "quizy",
        player_id: battlePlayerId(),
      });
      if (!result.room_id || !result.player_token || !result.state) throw new Error("That room could not be joined.");
      remember(result.room_id, result.player_token);
      setView(result.state);
      poke(result.room_id);
    });
  }

  function inviteLink() {
    const url = new URL("/", window.location.origin);
    url.searchParams.set("room", view?.code || "");
    return url.toString();
  }

  async function copyText(value: string, message: string) {
    try {
      await navigator.clipboard.writeText(value);
      setShareNote(message);
    } catch {
      setError("Could not copy. Please select and copy the room code.");
    }
  }

  async function shareInvite() {
    const url = inviteLink();
    const text = "Join my Quizy online game. Room code: " + (view?.code || "");
    try {
      if (navigator.share) await navigator.share({ title: "Join my Quizy game", text, url });
      else await navigator.clipboard.writeText(url);
      setShareNote("Invite ready to share.");
    } catch (caught) {
      if (caught instanceof Error && caught.name !== "AbortError") setError("Could not open sharing. Copy the invite link instead.");
    }
  }

  if (!view) {
    return (
      <section className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
        <div className="rounded-card border border-line bg-surface p-5">
          <h2 className="font-display text-3xl font-semibold">Create a room</h2>
          <p className="mt-2 text-muted">Share a six-letter code. The answer key stays on the server until the round closes.</p>
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              run(async () => {
                const result = await battleCall("create", {
                  player_id: battlePlayerId(),
                  name: name || "Explorer",
                  avatar: "quizy",
                  difficulty: difficulty === "advanced" ? "difficult" : difficulty,
                  age,
                });
                if (!result.room_id || !result.player_token || !result.state) throw new Error("The battle room did not open.");
                remember(result.room_id, result.player_token);
                setView(result.state);
                poke(result.room_id);
              })
            }
            className="mt-4 min-h-12 w-full rounded-2xl bg-primary font-extrabold text-primary-fg"
          >
            Create room
          </button>
        </div>
        <form
          className="rounded-card border border-line bg-surface p-5"
          onSubmit={(event) => {
            event.preventDefault();
            void joinRoom(code);
          }}
        >
          <h2 className="font-display text-3xl font-semibold">Join with a code</h2>
          <input
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            maxLength={6}
            aria-label="Room code"
            placeholder="ABC123"
            className="mt-4 min-h-12 w-full rounded-2xl border border-line bg-surface-2 px-4 text-center text-2xl font-extrabold tracking-widest text-fg"
          />
          <button type="submit" disabled={busy} className="mt-3 min-h-12 w-full rounded-2xl bg-gold font-extrabold text-gold-fg">
            Join room
          </button>
        </form>
        <div className="rounded-card border border-line p-5 md:col-span-2">
          <h3 className="font-display text-2xl font-semibold">Bluetooth</h3>
          {native ? (
            <div className="mt-3 grid gap-2">
              <button type="button" onClick={() => native.host()} className="min-h-11 rounded-2xl border border-line font-extrabold">
                Host on this phone
              </button>
              {devices.map((device) => (
                <button
                  key={device.address}
                  type="button"
                  onClick={() => native.connect(device.address)}
                  className="min-h-11 rounded-2xl border border-line px-4 text-left font-extrabold"
                >
                  Join {device.name}
                </button>
              ))}
              {btNote && <p className="text-sm text-muted">{btNote}</p>}
            </div>
          ) : (
            <p className="mt-2 text-muted">
              Nearby Bluetooth battle runs in the Quizy Android app. In a browser, use an online room. The room is scored by the existing Quizy battle service.
            </p>
          )}
        </div>
        {error && <p className="text-bad md:col-span-2">{error}</p>}
      </section>
    );
  }

  const question = view.status === "playing" || view.status === "play" ? view.question : null;
  const leader = [...view.players].sort((a, b) => b.score - a.score)[0];
  return (
    <section className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-widest text-gold">Room {view.code}</p>
          <h2 className="font-display text-3xl font-semibold">
            {view.status === "lobby"
              ? "Waiting"
              : view.status === "finished" || view.status === "done"
                ? "Battle complete"
                : `Round ${view.current_round + 1} of ${view.total_rounds}`}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => {
            void battleCall("leave", { room_id: roomId, player_token: token });
            sessionStorage.removeItem(SESSION);
            setView(null);
            setToken("");
            setRoomId("");
          }}
          className="min-h-11 rounded-2xl border border-line px-4 font-extrabold"
        >
          Leave
        </button>
      </div>
      {view.status === "lobby" && view.me?.is_host && (
        <div className="mt-4 rounded-2xl border border-line bg-surface p-4">
          <p className="font-extrabold">Invite someone to play</p>
          <p className="mt-1 text-sm text-muted">Send the room code or share a link that opens this room.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <button type="button" onClick={() => void copyText(view.code, "Room code copied.")} className="min-h-11 rounded-2xl border border-line font-extrabold">
              Copy room code
            </button>
            <button type="button" onClick={() => void copyText(inviteLink(), "Invite link copied.")} className="min-h-11 rounded-2xl border border-line font-extrabold">
              Copy invite link
            </button>
            <button type="button" onClick={() => void shareInvite()} className="min-h-11 rounded-2xl bg-primary font-extrabold text-primary-fg">
              Share invite
            </button>
          </div>
          {shareNote && <p aria-live="polite" className="mt-2 text-sm text-muted">{shareNote}</p>}
        </div>
      )}
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {view.players.map((player) => (
          <li key={player.player_id} className="rounded-2xl border border-line bg-surface px-4 py-3">
            <span className="font-extrabold">
              {player.display_name}
              {player.player_id === view.me?.player_id ? " · you" : ""}
            </span>
            <span className="mt-1 block text-sm text-muted">{player.score} points</span>
          </li>
        ))}
      </ul>
      {view.status === "lobby" && view.me?.is_host && (
        <button
          type="button"
          disabled={busy || view.players.length < 2}
          onClick={() =>
            run(async () => {
              const result = await battleCall("start", { room_id: roomId, player_token: token });
              if (result.state) setView(result.state);
              poke(roomId);
            })
          }
          className="mt-4 min-h-12 w-full rounded-2xl bg-primary font-extrabold text-primary-fg disabled:opacity-50"
        >
          Start when everyone is here
        </button>
      )}
      {view.status === "lobby" && !view.me?.is_host && <p className="mt-4 text-muted">Waiting for the host to start.</p>}
      {question && (
        <div className="mt-5">
          <h3 className="font-display text-3xl font-semibold leading-tight">{question.q}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {question.opts.map((option, index) => {
              const mine = view.results?.find((row) => row.player_id === view.me?.player_id);
              return (
                <button
                  key={option}
                  type="button"
                  disabled={busy || view.my_submitted || view.round_resolved}
                  onClick={() =>
                    run(async () => {
                      const result = await battleCall("answer", {
                        room_id: roomId,
                        player_token: token,
                        round: view.current_round,
                        answer_index: index,
                      });
                      if (result.state) setView(result.state);
                      poke(roomId);
                    })
                  }
                  className={`min-h-14 rounded-2xl border px-4 text-left text-lg font-extrabold ${
                    view.round_resolved && mine?.correct && index === 0 ? "border-line bg-surface" : "border-line bg-surface"
                  }`}
                >
                  <span className="keycap mr-2">{String.fromCharCode(65 + index)}</span>
                  {option}
                </button>
              );
            })}
          </div>
          {view.my_submitted && !view.round_resolved && <p className="mt-3 text-muted">Your answer is locked. Waiting for everyone else.</p>}
          {view.round_resolved && (
            <div className="mt-4 space-y-2">
              {(view.results ?? []).map((result) => {
                const player = view.players.find((item) => item.player_id === result.player_id);
                return (
                  <p key={result.player_id} className={result.correct ? "font-extrabold text-good" : "font-extrabold text-bad"}>
                    {player?.display_name ?? "Explorer"} {result.correct ? "is correct" : "missed"}
                  </p>
                );
              })}
              {question.exp && <p className="text-muted">{question.exp}</p>}
              {view.me?.is_host && (
                <button
                  type="button"
                  onClick={() =>
                    run(async () => {
                      const result = await battleCall("next", { room_id: roomId, player_token: token });
                      if (result.state) setView(result.state);
                      poke(roomId);
                    })
                  }
                  className="min-h-12 w-full rounded-2xl bg-gold font-extrabold text-gold-fg"
                >
                  {view.current_round + 1 >= view.total_rounds ? "Show the winner" : "Next round"}
                </button>
              )}
            </div>
          )}
        </div>
      )}
      {(view.status === "finished" || view.status === "done") && leader && (
        <p className="mt-4 font-display text-2xl font-semibold">
          {leader.display_name} leads with {leader.score} points.
        </p>
      )}
      {error && <p className="mt-3 text-bad">{error}</p>}
    </section>
  );
}
