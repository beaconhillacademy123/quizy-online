import raw from "@/data/bank.json";

export type Difficulty = "easy" | "medium" | "difficult" | "advanced";
export type Age = "young" | "old";

export type ChoiceQ = {
  kind: "choice";
  id: string;
  q: string;
  opts: string[];
  a: number;
  exp: string;
  difficulty: Difficulty;
  age8: boolean;
  replace: boolean;
};

export type SpellQ = {
  kind: "spell";
  id: string;
  word: string;
  hint: string;
  difficulty: Difficulty;
  age8: boolean;
  replace: boolean;
};

export type BankQ = ChoiceQ | SpellQ;

export type Land = {
  id: string;
  name: string;
  mode: "choice" | "spelling";
  count: number;
  questions: BankQ[];
};

export type AcademyQ = {
  id: string;
  year: number;
  term: string;
  subject: string;
  topic: string;
  difficulty: Difficulty;
  q: string;
  opts: string[];
  a: number;
  exp: string;
  media: { type: string; title: string; items: [string, number][] } | null;
};

export type BreakCard = { type: string; text: string; answer: string };

export type MediaChart = { title: string; items: [string, number][] } | null;

export type PlayItem =
  | {
      kind: "choice";
      id: string;
      q: string;
      opts: string[];
      a: number;
      exp: string;
      hidden: number[];
      media: MediaChart;
    }
  | { kind: "spell"; id: string; word: string; hint: string };

export const lands = raw.lands as Land[];
export const academyQuestions = raw.academy as AcademyQ[];
export const breakCards = raw.breaks as BreakCard[];

const remoteByLand = new Map<string, BankQ[]>();

/** Cloud questions whose ids are not already in the local bank. Local questions win. */
export function setRemoteQuestions(entries: { landId: string; question: BankQ }[]) {
  remoteByLand.clear();
  const local = new Set(lands.flatMap((land) => land.questions.map((question) => question.id)));
  for (const entry of entries) {
    if (local.has(entry.question.id)) continue;
    const list = remoteByLand.get(entry.landId) ?? [];
    list.push(entry.question);
    remoteByLand.set(entry.landId, list);
  }
}

function questionsFor(land: Land) {
  return land.questions.concat(remoteByLand.get(land.id) ?? []);
}

export const ADVANCED_MODES = [
  "Beast Mode",
  "Mastermind",
  "Quiz Master",
  "Dragon Mode",
  "Ultimate Challenge",
  "Legend Mode",
  "Elite Mode",
  "Volcano Mode",
] as const;

export const TERMS = [
  { id: "t1", name: "First term" },
  { id: "t2", name: "Second term" },
  { id: "t3", name: "Third term" },
] as const;

export const BADGES: { id: string; name: string; detail: string }[] = [
  { id: "first", name: "First footprint", detail: "Finish a land." },
  { id: "streak", name: "Ten in a row", detail: "Ten correct answers without a miss." },
  { id: "daily", name: "Dawn explorer", detail: "Finish today's challenge." },
  { id: "trail", name: "Full trail", detail: "Finish every land." },
  { id: "sharp", name: "Sharp eye", detail: "Score 8 or more on a land." },
  { id: "spell", name: "Word keeper", detail: "Finish Spelling Bee." },
  { id: "scholar", name: "Year one scholar", detail: "Finish an Academy set." },
  { id: "duel", name: "Table champion", detail: "Win a pass-and-play duel." },
];

export function landById(id: string) {
  return lands.find((land) => land.id === id);
}

export function shuffle<T>(list: readonly T[], rnd: () => number = Math.random): T[] {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const left = a[i];
    const right = a[j];
    if (left === undefined || right === undefined) continue;
    a[i] = right;
    a[j] = left;
  }
  return a;
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 1831565813) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function todayKey(d = new Date()) {
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function ageOk(q: BankQ, age: Age) {
  return age === "old" ? q.age8 : !q.age8 && !q.replace;
}

function prepareChoice(
  q: { id: string; q: string; opts: string[]; a: number; exp: string },
  rnd: () => number,
  media: MediaChart = null,
): PlayItem {
  const correct = q.opts[q.a] ?? "";
  const opts = shuffle(q.opts, rnd);
  const answer = Math.max(0, opts.indexOf(correct));
  return { kind: "choice", id: q.id, q: q.q, opts, a: answer, exp: q.exp, hidden: [], media };
}

function sentenceKey(q: { kind?: string; q?: string; word?: string }) {
  if (q.kind === "spell") return `spell:${(q.word ?? "").trim().toLowerCase()}`;
  return (q.q ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function dedupeBank(list: BankQ[]) {
  const seen = new Set<string>();
  const unique: BankQ[] = [];
  for (const question of list) {
    const key = sentenceKey(question);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(question);
  }
  return unique;
}

const DIFFICULTY_LADDER: Difficulty[] = ["easy", "medium", "difficult", "advanced"];

function difficultyOrder(current: Difficulty) {
  const start = Math.max(0, DIFFICULTY_LADDER.indexOf(current));
  return [...DIFFICULTY_LADDER.slice(start), ...DIFFICULTY_LADDER.slice(0, start).reverse()];
}

function toPlayItem(q: BankQ, rnd: () => number = Math.random): PlayItem {
  return q.kind === "spell"
    ? { kind: "spell", id: q.id, word: q.word, hint: q.hint }
    : prepareChoice(q, rnd);
}

function takeFresh(groups: BankQ[][], blocked: Set<string>, count: number, rnd: () => number = Math.random) {
  const chosen: BankQ[] = [];
  const seen = new Set(blocked);
  const pull = (list: BankQ[], ignoreBlocked: boolean) => {
    for (const question of shuffle(dedupeBank(list), rnd)) {
      const key = sentenceKey(question);
      if (!ignoreBlocked && seen.has(key)) continue;
      if (chosen.some((item) => sentenceKey(item) === key)) continue;
      seen.add(key);
      chosen.push(question);
      if (chosen.length >= count) return true;
    }
    return false;
  };
  for (const group of groups) {
    if (pull(group, false)) return chosen;
  }
  for (const group of groups) {
    if (pull(group, true)) return chosen;
  }
  return chosen;
}

export function blockedSentences(history: Record<string, string[]>) {
  const byId = new Map<string, string>();
  for (const land of lands) {
    for (const question of questionsFor(land)) byId.set(question.id, sentenceKey(question));
  }
  for (const question of academyQuestions) byId.set(question.id, sentenceKey({ kind: "choice", q: question.q }));
  const blocked = new Set<string>();
  for (const [key, ids] of Object.entries(history)) {
    if (key.startsWith("break|") || !Array.isArray(ids)) continue;
    for (const id of ids) {
      const sentence = byId.get(id);
      if (sentence) blocked.add(sentence);
    }
  }
  return blocked;
}

export function pickLandQuestions(
  land: Land,
  age: Age,
  difficulty: Difficulty,
  usedIds: string[],
  blocked: Set<string> = new Set(),
): PlayItem[] {
  const bank = questionsFor(land);
  const used = new Set(usedIds);
  const avoid = new Set(blocked);
  for (const question of bank) {
    if (used.has(question.id)) avoid.add(sentenceKey(question));
  }
  const groups = difficultyOrder(difficulty).map((level) => {
    const sameAge = bank.filter((question) => question.difficulty === level && ageOk(question, age));
    if (sameAge.length > 0) return sameAge;
    return bank.filter((question) => question.difficulty === level);
  });
  return takeFresh(groups, avoid, land.count, Math.random).map((question) => toPlayItem(question));
}

function choicePool(age: Age, difficulty: Difficulty) {
  const all = lands.flatMap((land) => questionsFor(land)).filter((q): q is ChoiceQ => q.kind === "choice");
  if (difficulty === "advanced") {
    const advanced = all.filter((q) => q.difficulty === "advanced");
    if (advanced.length >= 6) return advanced;
  }
  let pool = all.filter((q) => q.difficulty === difficulty && ageOk(q, age));
  if (pool.length < 6) pool = all.filter((q) => q.difficulty === difficulty);
  if (pool.length < 6) pool = all.filter((q) => ageOk(q, age));
  if (pool.length < 6) pool = all;
  return pool;
}

export function pickMixed(
  age: Age,
  difficulty: Difficulty,
  count: number,
  rnd: () => number = Math.random,
  blocked: Set<string> = new Set(),
) {
  const pool = choicePool(age, difficulty);
  return takeFresh([pool], blocked, count, rnd).flatMap((question) =>
    question.kind === "choice" ? [prepareChoice(question, rnd)] : [],
  );
}

export function pickDaily(age: Age, difficulty: Difficulty, key: string, blocked: Set<string> = new Set()) {
  return pickMixed(age, difficulty, 5, mulberry32(Number(key.replaceAll("-", "")) || 1), blocked);
}

export function pickBonus(age: Age, difficulty: Difficulty, blocked: Set<string> = new Set()) {
  const [item] = pickMixed(age, difficulty, 1, Math.random, blocked);
  return item ?? null;
}

export function academySubjects() {
  const map = new Map<string, number>();
  for (const question of academyQuestions) map.set(question.subject, (map.get(question.subject) ?? 0) + 1);
  return [...map.entries()].map(([subject, count]) => ({ subject, count }));
}

export function pickAcademy(subject: string, blocked: Set<string> = new Set()) {
  const pool = academyQuestions.filter((question) => question.subject === subject);
  const fresh = takeFresh(
    [pool.map((question) => ({ ...question, kind: "choice" as const, word: "", hint: "", age8: true, replace: false }))],
    blocked,
    Math.min(6, pool.length),
  );
  return fresh.map((question) => {
    const source = pool.find((item) => item.id === question.id) ?? pool[0];
    if (!source) return null;
    return prepareChoice(source, Math.random, source.media ? { title: source.media.title, items: source.media.items } : null);
  }).filter((item): item is PlayItem => item !== null);
}

export function randomBreak(seen: string[] = []) {
  const unseen = breakCards.filter((card) => !seen.includes(card.text));
  const last = seen[seen.length - 1];
  const deck = unseen.length > 0 ? unseen : breakCards.filter((card) => card.text !== last);
  const card = shuffle(deck.length > 0 ? deck : breakCards)[0] ?? breakCards[0];
  if (!card) return { card: null, seen };
  const nextSeen = unseen.length > 0 ? [...seen, card.text] : [card.text];
  return { card, seen: nextSeen };
}

let audio: AudioContext | null = null;

export function playTone(ok: boolean) {
  if (typeof window === "undefined") return;
  try {
    const Ctx = window.AudioContext;
    if (!audio) audio = new Ctx();
    if (audio.state === "suspended") void audio.resume();
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = "sine";
    osc.frequency.value = ok ? 587 : 196;
    if (!ok) osc.frequency.exponentialRampToValueAtTime(140, audio.currentTime + 0.16);
    gain.gain.value = 0.045;
    osc.connect(gain);
    gain.connect(audio.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(1e-4, audio.currentTime + 0.2);
    osc.stop(audio.currentTime + 0.21);
  } catch {
    /* sound is optional */
  }
}

export function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.92;
  utterance.lang = "en-GB";
  window.speechSynthesis.speak(utterance);
}

export function stopSpeak() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}
