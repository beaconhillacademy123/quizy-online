import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type Age,
  type Difficulty,
  type PlayItem,
  type BreakCard,
  landById,
  lands,
  pickAcademy,
  pickBonus,
  pickDaily,
  pickLandQuestions,
  pickMixed,
  playTone,
  randomBreak,
  shuffle,
  todayKey,
} from "@/lib/quiz/logic";

export type Screen =
  | "camp"
  | "map"
  | "play"
  | "break"
  | "shop"
  | "badges"
  | "daily"
  | "board"
  | "academy"
  | "bonus"
  | "summary"
  | "certificate"
  | "battle"
  | "command";

export type RoundMode = "land" | "daily" | "academy" | "battle";

export type Round = {
  mode: RoundMode;
  landId?: string;
  title: string;
  items: PlayItem[];
  index: number;
  picks: Array<number | string | null>;
  revealed: boolean;
  correct: number;
  p1Name?: string;
  p2Name?: string;
  p1Score?: number;
  p2Score?: number;
  p1Pick?: number | null;
  phase?: "p1" | "pass" | "p2" | "reveal";
};

export type BoardEntry = { name: string; stars: number; coins: number; at: number };

type State = {
  name: string;
  age: Age;
  difficulty: Difficulty;
  challenge: string;
  coins: number;
  badges: string[];
  totalStars: number;
  landStars: Record<string, number>;
  landCorrect: Record<string, number>;
  landDone: Record<string, boolean>;
  bestStreak: number;
  history: Record<string, string[]>;
  dailyDate: string;
  dailyDone: boolean;
  dailyScore: number;
  board: BoardEntry[];
  voiceOn: boolean;
  role: "" | "explorer" | "owner";
  screen: Screen;
  lives: number;
  hints: number;
  streak: number;
  round: Round | null;
  breakCard: BreakCard | null;
  breakShown: boolean;
  breakAfter: Screen;
  shopForced: boolean;
  bonus: PlayItem | null;
  bonusPick: number | null;
  bonusRevealed: boolean;
  summaryNote: string;
  setName: (name: string) => void;
  setAge: (age: Age) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setChallenge: (challenge: string) => void;
  setRole: (role: "" | "explorer" | "owner") => void;
  toggleVoice: () => void;
  begin: () => void;
  go: (screen: Screen) => void;
  park: (screen?: Screen) => void;
  startLand: (id: string) => void;
  answerChoice: (index: number) => void;
  submitSpell: (typed: string) => void;
  useHint: () => void;
  next: () => void;
  buyLife: () => void;
  refillHints: () => void;
  abandon: () => void;
  openBonus: () => void;
  answerBonus: (index: number) => void;
  leaveBonus: () => void;
  revealBreak: () => void;
  continueBreak: () => void;
  startDaily: () => void;
  startAcademy: (subject: string) => void;
  startBattle: (p1: string, p2: string) => void;
  battlePick: (index: number) => void;
  battleAdvance: () => void;
};

function unlock(badges: string[], id: string) {
  return badges.includes(id) ? badges : [...badges, id];
}

function remember(history: Record<string, string[]>, key: string, id: string) {
  const prev = history[key] ?? [];
  if (prev.includes(id)) return history;
  return { ...history, [key]: [...prev, id] };
}

function pushBoard(board: BoardEntry[], entry: BoardEntry) {
  const rest = board.filter((row) => row.name.toLowerCase() !== entry.name.toLowerCase());
  return [entry, ...rest].sort((a, b) => b.stars - a.stars || b.coins - a.coins).slice(0, 8);
}

const freshLive = {
  screen: "camp" as Screen,
  lives: 3,
  hints: 3,
  streak: 0,
  round: null as Round | null,
  breakCard: null as BreakCard | null,
  breakShown: false,
  breakAfter: "map" as Screen,
  shopForced: false,
  bonus: null as PlayItem | null,
  bonusPick: null as number | null,
  bonusRevealed: false,
  summaryNote: "",
};

export const useQuiz = create<State>()(
  persist(
    (set, get) => ({
      name: "",
      age: "young",
      difficulty: "easy",
      challenge: "",
      coins: 0,
      badges: [],
      totalStars: 0,
      landStars: {},
      landCorrect: {},
      landDone: {},
      bestStreak: 0,
      history: {},
      dailyDate: "",
      dailyDone: false,
      dailyScore: 0,
      board: [],
      voiceOn: true,
      role: "",
      ...freshLive,
      setName: (name) => set({ name }),
      setAge: (age) => set({ age }),
      setDifficulty: (difficulty) => set({ difficulty, challenge: difficulty === "advanced" ? get().challenge || "Beast Mode" : "" }),
      setChallenge: (challenge) => set({ challenge, difficulty: "advanced" }),
      setRole: (role) => set({ role }),
      toggleVoice: () => set({ voiceOn: !get().voiceOn }),
      begin: () => {
        const s = get();
        const name = s.name.trim() || "Explorer";
        const today = todayKey();
        const dailyDone = s.dailyDate === today && s.dailyDone;
        if (s.round) {
          set({
            name,
            screen: s.shopForced ? "shop" : "play",
            dailyDone,
            dailyDate: dailyDone ? today : s.dailyDate,
          });
          return;
        }
        set({
          name,
          ...freshLive,
          screen: "map",
          dailyDone,
          dailyDate: dailyDone ? today : s.dailyDate,
        });
      },
      go: (screen) => {
        if (get().shopForced && screen !== "shop" && screen !== "bonus") return;
        set({ screen });
      },
      park: (screen = "map") => {
        if (get().shopForced) return;
        set({
          screen,
          breakCard: null,
          breakShown: false,
          bonus: null,
          bonusPick: null,
          bonusRevealed: false,
        });
      },
      startLand: (id) => {
        const land = landById(id);
        if (!land) return;
        const s = get();
        const key = `${s.name}|${id}|${s.difficulty}`;
        const items = pickLandQuestions(land, s.age, s.difficulty, s.history[key] ?? []);
        if (!items.length) return;
        set({
          screen: "play",
          shopForced: false,
          round: {
            mode: "land",
            landId: id,
            title: s.difficulty === "advanced" && s.challenge ? `${s.challenge} · ${land.name}` : land.name,
            items,
            index: 0,
            picks: items.map(() => null),
            revealed: false,
            correct: 0,
          },
        });
      },
      answerChoice: (index) => {
        const s = get();
        const round = s.round;
        if (!round || round.revealed || round.mode === "battle") return;
        const item = round.items[round.index];
        if (!item || item.kind !== "choice" || item.hidden.includes(index)) return;
        const ok = index === item.a;
        playTone(ok);
        const picks = round.picks.slice();
        picks[round.index] = index;
        let { coins, streak, bestStreak, badges, totalStars, landStars, history, lives } = s;
        if (round.mode === "land" && round.landId) {
          history = remember(history, `${s.name}|${round.landId}|${s.difficulty}`, item.id);
          if (ok) {
            totalStars += 1;
            landStars = { ...landStars, [round.landId]: (landStars[round.landId] ?? 0) + 1 };
            coins += 10;
            streak += 1;
            if (streak === 3) coins += 5;
            if (streak > bestStreak) bestStreak = streak;
            if (streak >= 10) badges = unlock(badges, "streak");
          } else {
            lives = Math.max(0, lives - 1);
            streak = 0;
          }
        }
        const correct = round.correct + (ok ? 1 : 0);
        set({
          coins,
          streak,
          bestStreak,
          badges,
          totalStars,
          landStars,
          history,
          lives,
          round: { ...round, picks, revealed: true, correct },
          shopForced: round.mode === "land" && lives === 0,
          screen: round.mode === "land" && lives === 0 ? "shop" : "play",
        });
      },
      submitSpell: (typed) => {
        const s = get();
        const round = s.round;
        if (!round || round.revealed || !round.landId) return;
        const item = round.items[round.index];
        if (!item || item.kind !== "spell") return;
        const ok = typed.trim().toLowerCase() === item.word.toLowerCase();
        playTone(ok);
        const picks = round.picks.slice();
        picks[round.index] = typed.trim();
        let { coins, streak, bestStreak, badges, totalStars, landStars, history, lives } = s;
        history = remember(history, `${s.name}|${round.landId}|${s.difficulty}`, item.id);
        if (ok) {
          totalStars += 1;
          landStars = { ...landStars, [round.landId]: (landStars[round.landId] ?? 0) + 1 };
          coins += 10;
          streak += 1;
          if (streak === 3) coins += 5;
          if (streak > bestStreak) bestStreak = streak;
          if (streak >= 10) badges = unlock(badges, "streak");
        } else {
          lives = Math.max(0, lives - 1);
          streak = 0;
        }
        set({
          coins,
          streak,
          bestStreak,
          badges,
          totalStars,
          landStars,
          history,
          lives,
          round: { ...round, picks, revealed: true, correct: round.correct + (ok ? 1 : 0) },
          shopForced: lives === 0,
          screen: lives === 0 ? "shop" : "play",
        });
      },
      useHint: () => {
        const s = get();
        const round = s.round;
        if (!round || s.hints <= 0 || round.revealed) return;
        const item = round.items[round.index];
        if (!item || item.kind !== "choice") return;
        const wrong = item.opts.map((_, i) => i).filter((i) => i !== item.a && !item.hidden.includes(i));
        const hide = shuffle(wrong).slice(0, 2);
        const items = round.items.slice();
        items[round.index] = { ...item, hidden: [...item.hidden, ...hide] };
        set({ hints: s.hints - 1, round: { ...round, items } });
      },
      next: () => {
        const s = get();
        const round = s.round;
        if (!round || !round.revealed) return;
        if (s.lives <= 0 && round.mode === "land") {
          set({ screen: "shop", shopForced: true });
          return;
        }
        if (round.index < round.items.length - 1) {
          set({ round: { ...round, index: round.index + 1, revealed: false } });
          return;
        }
        if (round.mode === "land" && round.landId) {
          const land = landById(round.landId);
          const count = land?.count ?? round.items.length;
          const sessionCorrect = round.correct;
          let badges = unlock(s.badges, "first");
          badges = unlock(badges, round.landId);
          if (sessionCorrect >= Math.ceil(count * 0.8)) badges = unlock(badges, "sharp");
          if (land?.mode === "spelling") badges = unlock(badges, "spell");
          const landDone = { ...s.landDone, [round.landId]: true };
          const landCorrect = {
            ...s.landCorrect,
            [round.landId]: Math.max(s.landCorrect[round.landId] ?? 0, sessionCorrect),
          };
          const finishedAll = lands.every((l) => landDone[l.id]);
          if (finishedAll) badges = unlock(badges, "trail");
          let coins = s.coins + 25;
          if (sessionCorrect >= count) coins += 20;
          const board = finishedAll
            ? pushBoard(s.board, { name: s.name, stars: s.totalStars, coins, at: Date.now() })
            : s.board;
          set({
            badges,
            landDone,
            landCorrect,
            coins,
            board,
            round: null,
            breakCard: randomBreak() ?? null,
            breakShown: false,
            breakAfter: finishedAll ? "certificate" : "map",
            screen: "break",
            shopForced: false,
          });
          return;
        }
        if (round.mode === "daily") {
          const today = todayKey();
          set({
            dailyDone: true,
            dailyDate: today,
            dailyScore: round.correct,
            coins: s.coins + 75,
            badges: unlock(s.badges, "daily"),
            screen: "summary",
            summaryNote: `Daily challenge complete. ${round.correct} of ${round.items.length} correct. 75 coins added.`,
            round: null,
          });
          return;
        }
        if (round.mode === "academy") {
          set({
            badges: unlock(s.badges, "scholar"),
            coins: s.coins + 15,
            screen: "summary",
            summaryNote: `${round.title} complete. ${round.correct} of ${round.items.length} correct.`,
            round: null,
          });
        }
      },
      buyLife: () => {
        const s = get();
        if (s.lives >= 3 || s.coins < 10) return;
        const lives = s.lives + 1;
        set({
          coins: s.coins - 10,
          lives,
          shopForced: lives === 0,
          screen: s.shopForced && lives > 0 && s.round ? "play" : "shop",
        });
      },
      refillHints: () => {
        const s = get();
        if (s.hints >= 3 || s.coins < 20) return;
        set({ coins: s.coins - 20, hints: 3 });
      },
      abandon: () =>
        set({
          ...freshLive,
          screen: "map",
          lives: 3,
          hints: 3,
        }),
      openBonus: () => {
        const s = get();
        const bonus = pickBonus(s.age, s.difficulty);
        if (!bonus) return;
        set({ screen: "bonus", bonus, bonusPick: null, bonusRevealed: false });
      },
      answerBonus: (index) => {
        const s = get();
        if (!s.bonus || s.bonus.kind !== "choice" || s.bonusRevealed) return;
        const ok = index === s.bonus.a;
        playTone(ok);
        set({
          bonusPick: index,
          bonusRevealed: true,
          lives: ok ? Math.min(3, s.lives + 1) : s.lives,
          coins: ok ? s.coins + 3 : s.coins,
        });
      },
      leaveBonus: () => {
        const s = get();
        if (s.lives > 0 && s.round) set({ screen: "play", shopForced: false, bonus: null });
        else set({ screen: "shop", bonus: null });
      },
      revealBreak: () => set({ breakShown: true, coins: get().breakShown ? get().coins : get().coins + 3 }),
      continueBreak: () => set({ screen: get().breakAfter, breakCard: null }),
      startDaily: () => {
        const s = get();
        const today = todayKey();
        if (s.dailyDate === today && s.dailyDone) {
          set({ screen: "daily" });
          return;
        }
        const items = pickDaily(s.age, s.difficulty, today);
        set({
          screen: "play",
          round: {
            mode: "daily",
            title: "Daily challenge",
            items,
            index: 0,
            picks: items.map(() => null),
            revealed: false,
            correct: 0,
          },
        });
      },
      startAcademy: (subject) => {
        const items = pickAcademy(subject);
        if (!items.length) return;
        set({
          screen: "play",
          round: {
            mode: "academy",
            title: subject,
            items,
            index: 0,
            picks: items.map(() => null),
            revealed: false,
            correct: 0,
          },
        });
      },
      startBattle: (p1, p2) => {
        const s = get();
        const items = pickMixed(s.age, s.difficulty, 6);
        set({
          screen: "play",
          round: {
            mode: "battle",
            title: "Pass and play",
            items,
            index: 0,
            picks: items.map(() => null),
            revealed: false,
            correct: 0,
            p1Name: p1.trim() || "Player 1",
            p2Name: p2.trim() || "Player 2",
            p1Score: 0,
            p2Score: 0,
            p1Pick: null,
            phase: "p1",
          },
        });
      },
      battlePick: (index) => {
        const round = get().round;
        if (!round || round.mode !== "battle" || round.phase === "pass" || round.phase === "reveal") return;
        const item = round.items[round.index];
        if (!item || item.kind !== "choice") return;
        if (round.phase === "p1") {
          set({ round: { ...round, p1Pick: index, phase: "pass" } });
          return;
        }
        const p1ok = round.p1Pick === item.a;
        const p2ok = index === item.a;
        playTone(p2ok || p1ok);
        set({
          round: {
            ...round,
            picks: round.picks.map((p, i) => (i === round.index ? index : p)),
            phase: "reveal",
            p1Score: (round.p1Score ?? 0) + (p1ok ? 1 : 0),
            p2Score: (round.p2Score ?? 0) + (p2ok ? 1 : 0),
            revealed: true,
          },
        });
      },
      battleAdvance: () => {
        const s = get();
        const round = s.round;
        if (!round || round.mode !== "battle") return;
        if (round.phase === "pass") {
          set({ round: { ...round, phase: "p2" } });
          return;
        }
        if (round.phase !== "reveal") return;
        if (round.index < round.items.length - 1) {
          set({
            round: {
              ...round,
              index: round.index + 1,
              revealed: false,
              phase: "p1",
              p1Pick: null,
            },
          });
          return;
        }
        const p1 = round.p1Score ?? 0;
        const p2 = round.p2Score ?? 0;
        const winner = p1 === p2 ? "It's a draw" : p1 > p2 ? round.p1Name : round.p2Name;
        const badges = p1 !== p2 ? unlock(s.badges, "duel") : s.badges;
        set({
          badges,
          coins: s.coins + 10,
          round: null,
          screen: "summary",
          summaryNote: `${winner}. ${round.p1Name} ${p1} — ${round.p2Name} ${p2}.`,
        });
      },
    }),
    {
      name: "quizy-expedition",
      skipHydration: true,
      partialize: (s) => ({
        name: s.name,
        age: s.age,
        difficulty: s.difficulty,
        challenge: s.challenge,
        coins: s.coins,
        badges: s.badges,
        totalStars: s.totalStars,
        landStars: s.landStars,
        landCorrect: s.landCorrect,
        landDone: s.landDone,
        bestStreak: s.bestStreak,
        history: s.history,
        dailyDate: s.dailyDate,
        dailyDone: s.dailyDone,
        dailyScore: s.dailyScore,
        board: s.board,
        voiceOn: s.voiceOn,
        screen: s.screen,
        lives: s.lives,
        hints: s.hints,
        streak: s.streak,
        round: s.round,
        shopForced: s.shopForced,
        bonus: s.bonus,
        bonusPick: s.bonusPick,
        bonusRevealed: s.bonusRevealed,
        breakCard: s.breakCard,
        breakShown: s.breakShown,
        breakAfter: s.breakAfter,
        savedAt: Date.now(),
      }),
    },
  ),
);
