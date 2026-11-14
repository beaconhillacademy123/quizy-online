import { useEffect, useState } from "react";
import { createClient, type Session, type User } from "@supabase/supabase-js";
import type { Age, BankQ, Difficulty } from "@/lib/quiz/logic";
import { useQuiz, type Round, type Screen } from "@/lib/quiz/store";

/** Publishable key already shipped in the existing Quizy client. Never put a service-role key here. */
const PUBLIC_URL = "https://snxehcpichoskvdtuveh.supabase.co";
const PUBLIC_KEY = "sb_publishable_54n8FEVRWSq1A17OeO-lxw_E_74g9Gh";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || PUBLIC_URL;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || PUBLIC_KEY;

if (/service_role/i.test(supabaseAnonKey)) {
  throw new Error("Refusing to start with a Supabase service-role key in the app.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

export type PublicFlags = {
  maintenance: boolean;
  registrationsEnabled: boolean;
  featureBattle: boolean;
  featureDaily: boolean;
  featureAcademy: boolean;
  featureNews: boolean;
  featureSports: boolean;
  announcement: string;
  forceUpdate: boolean;
  minAppVersion: string;
};

export type QuizMessage = {
  id: string;
  subject: string;
  message: string;
  sender_name: string | null;
  created_at: string;
};

export type BattlePlayer = {
  player_id: string;
  display_name: string;
  avatar: string;
  score: number;
  active?: boolean;
  is_host?: boolean;
};

export type BattleState = {
  room_id: string;
  code: string;
  status: string;
  current_round: number;
  total_rounds: number;
  round_resolved: boolean;
  players: BattlePlayer[];
  me?: { player_id: string; is_host: boolean };
  question?: { id?: string; q: string; opts: string[]; exp?: string };
  my_submitted?: boolean;
  submitted_count?: number;
  player_count?: number;
  results?: { player_id: string; correct: boolean }[];
};

export type CommandUser = {
  user_id: string;
  display_name: string;
  email_masked: string;
  suspended: boolean;
  last_active: string | null;
  badges: number;
  total_stars: number;
};

export type CommandSummary = {
  registered_users?: number;
  detected_installations?: number;
  daily_active?: number;
  daily_players?: number;
  questions_answered?: number;
  badges_earned?: number;
  daily?: { label: string; count: number }[];
};

export type CommandSettings = {
  maintenance_mode: boolean;
  registrations_enabled: boolean;
  feature_battle: boolean;
  feature_current_affairs: boolean;
  feature_sports: boolean;
  feature_daily_challenge: boolean;
  music_enabled: boolean;
  force_update: boolean;
  min_app_version: string;
  announcement: string | null;
};

const RESUME = "__resume";
const META = "__meta";

export function profileKey(name: string) {
  return (
    String(name || "Explorer")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "explorer"
  );
}

export function useQuizSession() {
  const [user, setUser] = useState<User | null>(null);
  const [pending, setPending] = useState(true);
  useEffect(() => {
    let live = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!live) return;
      setUser(data.session?.user ?? null);
      setPending(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session: Session | null) => {
      setUser(session?.user ?? null);
      setPending(false);
    });
    return () => {
      live = false;
      data.subscription.unsubscribe();
    };
  }, []);
  return { user, pending };
}

async function invoke(name: string, body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) {
    let message = error.message || "Quizy cloud is unavailable";
    const context = (error as { context?: Response }).context;
    if (context) {
      try {
        const parsed = (await context.clone().json()) as { error?: string; message?: string };
        message = parsed.error || parsed.message || message;
      } catch {
        /* keep the generic message */
      }
    }
    throw new Error(message);
  }
  if (data && typeof data === "object" && "error" in data && data.error) {
    throw new Error(String(data.error));
  }
  return data as Record<string, unknown>;
}

export async function loadFlags(): Promise<PublicFlags> {
  const { data, error } = await supabase.from("quizy_settings").select("key,value");
  if (error) throw error;
  const map = new Map<string, unknown>((data ?? []).map((row) => [String(row.key), row.value]));
  const text = (key: string) => (typeof map.get(key) === "string" ? String(map.get(key)) : "");
  const on = (key: string, fallback = true) => (map.has(key) ? map.get(key) !== false : fallback);
  return {
    maintenance: map.get("maintenance_mode") === true,
    registrationsEnabled: on("registrations_enabled"),
    featureBattle: on("feature_battle"),
    featureDaily: on("feature_daily_challenge"),
    featureAcademy: true,
    featureNews: on("feature_current_affairs"),
    featureSports: on("feature_sports"),
    announcement: text("announcement"),
    forceUpdate: map.get("force_update") === true,
    minAppVersion: text("min_app_version"),
  };
}

type RemoteRow = {
  id: string;
  land_id: string;
  age_band: string;
  difficulty: string;
  question: string;
  options: unknown;
  answer_index: number;
  explanation: string | null;
  word: string | null;
  hint: string | null;
  active: boolean;
  expires_at: string | null;
};

function asDifficulty(value: string): Difficulty {
  return value === "medium" || value === "difficult" || value === "advanced" ? value : "easy";
}

export async function loadRemoteQuestions() {
  const rows: RemoteRow[] = [];
  for (let from = 0; from < 5000; from += 1000) {
    const { data, error } = await supabase
      .from("quizy_questions")
      .select("id,land_id,age_band,difficulty,question,options,answer_index,explanation,word,hint,active,expires_at")
      .eq("active", true)
      .range(from, from + 999);
    if (error) throw error;
    rows.push(...((data ?? []) as RemoteRow[]));
    if (!data || data.length < 1000) break;
  }
  const now = Date.now();
  const questions: { landId: string; question: BankQ }[] = [];
  for (const row of rows) {
    if (row.expires_at && Date.parse(row.expires_at) < now) continue;
    const difficulty = asDifficulty(row.difficulty);
    const age8 = row.age_band === "old";
    if (row.word && !String(row.question || "").trim()) {
      questions.push({
        landId: row.land_id,
        question: {
          kind: "spell",
          id: row.id,
          word: row.word,
          hint: row.hint || "",
          difficulty,
          age8,
          replace: false,
        },
      });
      continue;
    }
    const opts = Array.isArray(row.options) ? row.options.map(String) : [];
    if (!row.question || opts.length < 2) continue;
    questions.push({
      landId: row.land_id,
      question: {
        kind: "choice",
        id: row.id,
        q: row.question,
        opts,
        a: Number(row.answer_index) || 0,
        exp: row.explanation || "",
        difficulty,
        age8,
        replace: false,
      },
    });
  }
  return questions;
}

function cleanHistory(history: Record<string, unknown>) {
  const next: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(history)) {
    if (key.startsWith("__")) continue;
    if (Array.isArray(value)) next[key] = value.map(String);
  }
  return next;
}

export async function pullProfile(userId: string, name: string) {
  const { data, error } = await supabase
    .from("quizy_profiles")
    .select("*")
    .eq("user_id", userId)
    .eq("profile_key", profileKey(name))
    .maybeSingle();
  if (error) throw error;
  return data as Record<string, unknown> | null;
}

export function applyCloudProfile(row: Record<string, unknown>) {
  const history = (row.question_history as Record<string, unknown>) ?? {};
  const meta = (history[META] as Record<string, unknown>) ?? {};
  const resume = (history[RESUME] as Record<string, unknown>) ?? (row.resume as Record<string, unknown>) ?? null;
  const difficulty = asDifficulty(String(meta.difficulty || row.difficulty || "easy"));
  const screens: Screen[] = ["camp", "map", "play", "shop", "bonus", "break", "badges", "daily", "board", "academy", "summary", "certificate", "battle"];
  const screen = screens.includes(resume?.screen as Screen) ? (resume?.screen as Screen) : undefined;
  useQuiz.setState({
    name: typeof row.display_name === "string" && row.display_name ? row.display_name : useQuiz.getState().name,
    age: row.age_band === "old" ? "old" : "young",
    difficulty,
    challenge: typeof meta.challenge === "string" ? meta.challenge : "",
    coins: Number(row.coins ?? 0),
    badges: Array.isArray(row.badges) ? (row.badges as string[]) : [],
    totalStars: Number(row.total_stars ?? 0),
    landStars: (row.land_stars as Record<string, number>) ?? {},
    landCorrect: (row.land_correct as Record<string, number>) ?? {},
    landDone: (row.land_done as Record<string, boolean>) ?? {},
    bestStreak: Number(row.best_streak ?? 0),
    history: cleanHistory(history),
    dailyDate: typeof meta.dailyDate === "string" ? meta.dailyDate : "",
    dailyDone: meta.dailyDone === true,
    dailyScore: Number(meta.dailyScore ?? 0),
    voiceOn: meta.voiceOn !== false,
    lives: Number(resume?.lives ?? 3),
    hints: Number(resume?.hints ?? 3),
    streak: Number(resume?.streak ?? 0),
    shopForced: resume?.shopForced === true,
    bonus: (resume?.bonus as never) ?? null,
    bonusPick: typeof resume?.bonusPick === "number" ? resume.bonusPick : null,
    bonusRevealed: resume?.bonusRevealed === true,
    breakCard: (resume?.breakCard as never) ?? null,
    breakShown: resume?.breakShown === true,
    breakAfter: resume?.breakAfter === "certificate" ? "certificate" : "map",
    ...(screen ? { screen, round: (resume?.round as Round | null) ?? null } : {}),
  });
}

let resumeColumn: boolean | null = null;

async function canSaveResumeColumn() {
  if (resumeColumn !== null) return resumeColumn;
  const { error } = await supabase.from("quizy_profiles").select("resume").limit(0);
  resumeColumn = !error;
  return resumeColumn;
}

export async function saveProfile(userId: string) {
  const state = useQuiz.getState();
  const name = state.name.trim() || "Explorer";
  const history: Record<string, unknown> = {
    ...state.history,
    [META]: {
      difficulty: state.difficulty,
      challenge: state.challenge,
      voiceOn: state.voiceOn,
      dailyDate: state.dailyDate,
      dailyDone: state.dailyDone,
      dailyScore: state.dailyScore,
      savedAt: Date.now(),
    },
    [RESUME]: {
      screen: state.screen,
      lives: state.lives,
      hints: state.hints,
      streak: state.streak,
      round: state.round,
      shopForced: state.shopForced,
      bonus: state.bonus,
      bonusPick: state.bonusPick,
      bonusRevealed: state.bonusRevealed,
      breakCard: state.breakCard,
      breakShown: state.breakShown,
      breakAfter: state.breakAfter,
    },
  };
  const row: Record<string, unknown> = {
    user_id: userId,
    profile_key: profileKey(name),
    display_name: name,
    age_band: state.age === "old" ? "old" : "young",
    difficulty: state.difficulty === "advanced" ? "advanced" : state.difficulty,
    avatar: "quizy",
    total_stars: state.totalStars,
    land_stars: state.landStars,
    land_correct: state.landCorrect,
    land_done: state.landDone,
    coins: state.coins,
    best_streak: state.bestStreak,
    badges: state.badges,
    unlocked: state.badges,
    theme: "night",
    question_history: history,
    music_on: false,
    sport_category: "",
    updated_at: new Date().toISOString(),
  };
  if (await canSaveResumeColumn()) row.resume = history[RESUME];
  const first = await supabase.from("quizy_profiles").upsert(row, { onConflict: "user_id,profile_key" });
  if (!first.error) return;
  if (row.difficulty === "advanced") {
    const second = await supabase
      .from("quizy_profiles")
      .upsert({ ...row, difficulty: "difficult" }, { onConflict: "user_id,profile_key" });
    if (!second.error) return;
    throw second.error;
  }
  throw first.error;
}

export async function logLandAttempt(userId: string, landId: string, correct: number, total: number) {
  const state = useQuiz.getState();
  const difficulty = state.difficulty === "advanced" ? "difficult" : state.difficulty;
  const { error } = await supabase.from("quizy_attempts").insert({
    user_id: userId,
    profile_id: null,
    land_id: landId,
    age_band: state.age,
    difficulty,
    score: correct,
    total_questions: total,
    correct_answers: correct,
  });
  if (error && state.difficulty === "advanced") {
    await supabase.from("quizy_attempts").insert({
      user_id: userId,
      profile_id: null,
      land_id: landId,
      age_band: state.age,
      difficulty: "difficult",
      score: correct,
      total_questions: total,
      correct_answers: correct,
    });
  }
}

export async function recordActivity(userId: string, eventType: string, metadata: Record<string, unknown> = {}) {
  await supabase.from("quizy_activity").insert({ user_id: userId, event_type: eventType, metadata });
}

export async function recordInstallation(userId: string) {
  let installKey = localStorage.getItem("quizy_command_install_key");
  if (!installKey) {
    installKey = crypto.randomUUID();
    localStorage.setItem("quizy_command_install_key", installKey);
  }
  const agent = navigator.userAgent || "";
  const platform = /Android/i.test(agent) ? "android" : /iPhone|iPad/i.test(agent) ? "ios" : "web";
  await supabase.from("quizy_installations").upsert(
    { user_id: userId, install_key: installKey, platform, last_seen_at: new Date().toISOString() },
    { onConflict: "user_id,install_key" },
  );
}

export async function listMessages(userId: string) {
  const { data, error } = await supabase
    .from("quizy_messages")
    .select("id,subject,message,sender_name,created_at")
    .eq("recipient_user_id", userId)
    .is("read_at", null)
    .order("created_at", { ascending: false })
    .limit(5);
  if (error) throw error;
  return (data ?? []) as QuizMessage[];
}

export async function acknowledgeMessage(id: string) {
  const { error } = await supabase.from("quizy_messages").update({ read_at: new Date().toISOString() }).eq("id", id);
  if (error) throw error;
}

export async function ownControl(userId: string) {
  const { data, error } = await supabase
    .from("quizy_user_controls")
    .select("suspended,reason")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) return null;
  return data as { suspended: boolean; reason: string | null } | null;
}

export async function sendFeedback(kind: "problem" | "idea", body: string, name: string, userId: string) {
  const comment = `${kind === "problem" ? "Problem" : "Idea"} from ${name}: ${body}`;
  const activity = await supabase.from("quizy_activity").insert({
    user_id: userId,
    event_type: "feedback",
    metadata: { kind, body, name },
  });
  const note = await supabase.from("parent_feedback").insert({ comment });
  if (activity.error && note.error) throw activity.error;
}

export async function listFeedback() {
  const { data, error } = await supabase.from("parent_feedback").select("id,comment").order("id", { ascending: false }).limit(30);
  if (error) return [];
  return (data ?? []) as { id: string; comment: string | null }[];
}

export function battlePlayerId() {
  const key = "quizy_battle_player_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `p${crypto.randomUUID().replaceAll("-", "").slice(0, 12)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

export async function battleCall(action: string, extra: Record<string, unknown> = {}) {
  const data = await invoke("quizy-online-battle", { action, ...extra });
  return data as {
    room_id?: string;
    code?: string;
    player_token?: string;
    state?: BattleState;
    ok?: boolean;
  };
}

export async function commandCall<T>(action: string, extra: Record<string, unknown> = {}) {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) throw new Error("Sign in with the owner account.");
  return (await invoke("quizy-command-center", { action, ...extra })) as T;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export type { Age };
