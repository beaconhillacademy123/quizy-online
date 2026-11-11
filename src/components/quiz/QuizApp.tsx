import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CalendarDays,
  CircleHelp,
  Coins,
  Cpu,
  Flame,
  FlaskConical,
  Globe2,
  Hash,
  Heart,
  Landmark,
  Lightbulb,
  Map,
  Newspaper,
  PawPrint,
  Puzzle,
  Rocket,
  Shield,
  SpellCheck,
  Swords,
  Tent,
  Trophy,
  Volume2,
  VolumeX,
  Waves,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { acknowledgeMessage, listMessages, signOut, useQuizSession, type PublicFlags, type QuizMessage } from "@/lib/quiz/cloud";
import {
  ADVANCED_MODES,
  BADGES,
  academySubjects,
  lands,
  speak,
  stopSpeak,
  todayKey,
  type Age,
  type Difficulty,
  type PlayItem,
} from "@/lib/quiz/logic";
import { useQuiz, type Round } from "@/lib/quiz/store";
import { BattleRoom } from "@/components/quiz/BattleRoom";
import { CloudSync } from "@/components/quiz/CloudSync";
import { CommandCenter } from "@/components/quiz/CommandCenter";
import { HelpMap } from "@/components/quiz/HelpMap";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const LAND_ICONS: Record<string, LucideIcon> = {
  animal: PawPrint,
  space: Rocket,
  ocean: Waves,
  number: Hash,
  world: Globe2,
  news: Newspaper,
  science: FlaskConical,
  logic: Puzzle,
  africa: Landmark,
  tech: Cpu,
  sports: Trophy,
  spelling: SpellCheck,
};

const AGES: { id: Age; label: string; note: string }[] = [
  { id: "young", label: "Ages 5–7", note: "Shorter words and warmer questions." },
  { id: "old", label: "Ages 8–10", note: "A fuller trail for older explorers." },
];

const LEVELS: { id: Difficulty; label: string; note: string }[] = [
  { id: "easy", label: "Easy", note: "Warm-up" },
  { id: "medium", label: "Medium", note: "Think it through" },
  { id: "difficult", label: "Difficult", note: "Challenge" },
  { id: "advanced", label: "Advanced", note: "Beast through Volcano — the harder add-on bank." },
];

const OPEN_FLAGS: PublicFlags = {
  maintenance: false,
  registrationsEnabled: true,
  featureBattle: true,
  featureDaily: true,
  featureAcademy: true,
  featureNews: true,
  featureSports: true,
  announcement: "",
  forceUpdate: false,
  minAppVersion: "",
};

export function QuizApp() {
  const screen = useQuiz((s) => s.screen);
  const round = useQuiz((s) => s.round);
  const [help, setHelp] = useState(false);
  const [flags, setFlags] = useState<PublicFlags>(OPEN_FLAGS);
  const onFlags = useCallback((next: PublicFlags) => setFlags(next), []);

  useEffect(() => {
    void useQuiz.persist.rehydrate().then(() => {
      if (new URLSearchParams(window.location.search).has("room")) {
        useQuiz.getState().go("battle");
      }
    });
  }, []);

  return (
    <main className="min-h-screen bg-bg text-fg">
      <CloudSync onFlags={onFlags} />
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-4 sm:px-6">
        <TopBar onHelp={() => setHelp(true)} />
        {flags.announcement && (
          <p className="mt-3 rounded-2xl border border-gold bg-surface px-4 py-3 text-sm font-bold">{flags.announcement}</p>
        )}
        {flags.maintenance && (
          <p className="mt-3 rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-muted">
            The expedition is in maintenance. Practice on this device still works. Online rooms may be paused.
          </p>
        )}
        {flags.forceUpdate && (
          <p className="mt-3 rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-muted">
            The expedition asked for version {flags.minAppVersion || "the current one"}. Update the installed app when
            you can. This page still opens.
          </p>
        )}
        <div key={`${screen}-${round?.index ?? "x"}-${round?.title ?? ""}`} className="screen-in mt-4 flex-1">
          {screen === "camp" && <Camp flags={flags} />}
          {screen === "map" && <Trail flags={flags} />}
          {screen === "play" && <Play />}
          {screen === "shop" && <Shop />}
          {screen === "bonus" && <Bonus />}
          {screen === "break" && <Break />}
          {screen === "badges" && <Badges />}
          {screen === "daily" && <Daily />}
          {screen === "board" && <Board />}
          {screen === "academy" && <Academy />}
          {screen === "summary" && <Summary />}
          {screen === "certificate" && <Certificate />}
          {screen === "battle" && <BattleRoom />}
          {screen === "command" && <CommandCenter />}
        </div>
      </div>
      {help && <HelpMap onClose={() => setHelp(false)} />}
    </main>
  );
}

function TopBar({ onHelp }: { onHelp: () => void }) {
  const screen = useQuiz((s) => s.screen);
  const name = useQuiz((s) => s.name);
  const role = useQuiz((s) => s.role);
  const voiceOn = useQuiz((s) => s.voiceOn);
  const toggleVoice = useQuiz((s) => s.toggleVoice);
  const park = useQuiz((s) => s.park);
  const go = useQuiz((s) => s.go);
  const shopForced = useQuiz((s) => s.shopForced);
  const onTrail = screen !== "camp";

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
      <button type="button" className="flex items-center gap-3" onClick={() => park(name ? "map" : "camp")}>
        <img src="/quizy-mark.png" alt="" className="size-11 rounded-xl object-cover" />
        <span className="text-left">
          <span className="block font-display text-xl font-semibold leading-none">Quizy</span>
          <span className="hidden text-sm text-muted sm:block">One question at a time</span>
        </span>
      </button>
      <div className="flex flex-wrap items-center justify-end gap-2">
        {role === "owner" && (
          <button
            type="button"
            onClick={() => go("command")}
            className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-gold px-3 text-sm font-extrabold text-gold"
          >
            <Shield className="size-4" aria-hidden />
            Command
          </button>
        )}
        {onTrail && !shopForced && (
          <button
            type="button"
            onClick={() => park(screen === "map" ? "camp" : "map")}
            className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-line px-3 text-sm font-extrabold"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {screen === "map" ? "Camp" : "Trail"}
          </button>
        )}
        <button
          type="button"
          onClick={onHelp}
          className="inline-flex size-11 items-center justify-center rounded-2xl border border-line"
          aria-label="Help map"
        >
          <CircleHelp className="size-5" />
        </button>
        <button
          type="button"
          aria-pressed={voiceOn}
          onClick={() => {
            if (voiceOn) stopSpeak();
            toggleVoice();
          }}
          className="inline-flex size-11 items-center justify-center rounded-2xl border border-line"
          aria-label={voiceOn ? "Turn voice off" : "Turn voice on"}
        >
          {voiceOn ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
        </button>
        <AccountChip />
      </div>
    </header>
  );
}

function AccountChip() {
  const { user, pending } = useQuizSession();
  const [busy, setBusy] = useState(false);
  if (pending) return null;
  if (!user) {
    return (
      <Link
        to="/login"
        className="inline-flex min-h-11 items-center rounded-2xl bg-primary px-3 text-sm font-extrabold text-primary-fg"
      >
        Sign in
      </Link>
    );
  }
  const label = user.email ?? "Account";
  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => {
        setBusy(true);
        signOut()
          .catch(() => {})
          .finally(() => setBusy(false));
      }}
      className="inline-flex min-h-11 max-w-44 items-center truncate rounded-2xl border border-line px-3 text-sm font-extrabold"
      title="Sign out of this Quizy account"
    >
      {busy ? "Signing out" : label}
    </button>
  );
}

function ResumeCard() {
  const round = useQuiz((s) => s.round);
  const shopForced = useQuiz((s) => s.shopForced);
  const go = useQuiz((s) => s.go);
  const abandon = useQuiz((s) => s.abandon);
  if (!round) return null;
  return (
    <div className="mt-4 rounded-card border border-gold bg-surface p-4">
      <p className="text-sm font-extrabold uppercase tracking-widest text-gold">Still open</p>
      <p className="mt-1 font-display text-2xl font-semibold">{round.title}</p>
      <p className="text-muted">
        Question {round.index + 1} of {round.items.length}. Leave or refresh and this question stays.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => go(shopForced ? "shop" : "play")}
          className="min-h-11 rounded-2xl bg-primary px-4 font-extrabold text-primary-fg"
        >
          Open this question
        </button>
        <button type="button" onClick={abandon} className="min-h-11 rounded-2xl border border-line px-4 font-extrabold">
          Stop this round
        </button>
      </div>
    </div>
  );
}

function Inbox() {
  const { user } = useQuizSession();
  const [rows, setRows] = useState<QuizMessage[]>([]);
  useEffect(() => {
    if (!user) {
      setRows([]);
      return;
    }
    listMessages(user.id)
      .then((notes) => setRows(notes.slice(0, 2)))
      .catch(() => setRows([]));
  }, [user?.id]);
  if (!user || rows.length === 0) return null;
  return (
    <div className="mt-4 space-y-2">
      {rows.map((row) => (
        <article key={row.id} className="rounded-2xl border border-gold bg-surface px-4 py-3">
          <p className="text-sm font-extrabold uppercase tracking-widest text-gold">{row.subject}</p>
          <p className="mt-1 text-sm leading-relaxed">{row.message}</p>
          <button
            type="button"
            onClick={() => {
              acknowledgeMessage(row.id)
                .then(() => setRows((current) => current.filter((item) => item.id !== row.id)))
                .catch(() => {});
            }}
            className="mt-2 text-sm font-extrabold text-muted"
          >
            Read
          </button>
        </article>
      ))}
    </div>
  );
}

function InstallButton() {
  const [prompt, setPrompt] = useState<(Event & { prompt: () => Promise<void> }) | null>(null);
  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as Event & { prompt: () => Promise<void> });
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);
  if (!prompt) return null;
  return (
    <button
      type="button"
      onClick={() => {
        void prompt.prompt();
        setPrompt(null);
      }}
      className="mt-4 inline-flex min-h-11 items-center rounded-2xl border border-line px-4 font-extrabold"
    >
      Add Quizy to this device
    </button>
  );
}

function Stats() {
  const lives = useQuiz((s) => s.lives);
  const coins = useQuiz((s) => s.coins);
  const streak = useQuiz((s) => s.streak);
  const hints = useQuiz((s) => s.hints);
  const screen = useQuiz((s) => s.screen);
  const round = useQuiz((s) => s.round);
  const go = useQuiz((s) => s.go);
  const useHint = useQuiz((s) => s.useHint);

  const pills: { label: string; value: string; icon: LucideIcon; onClick: () => void }[] = [
    { label: "Lives", value: String(lives), icon: Heart, onClick: () => go("shop") },
    { label: "Coins", value: String(coins), icon: Coins, onClick: () => go("shop") },
    { label: "Streak", value: String(streak), icon: Flame, onClick: () => go("badges") },
    {
      label: "Hints",
      value: String(hints),
      icon: Lightbulb,
      onClick: () => {
        if (screen === "play" && round && round.mode !== "battle" && round.mode !== "daily") useHint();
        else go("shop");
      },
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {pills.map((pill) => (
        <button
          key={pill.label}
          type="button"
          onClick={pill.onClick}
          className="rounded-2xl border border-line bg-surface px-2 py-2 text-left"
        >
          <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-muted">
            <pill.icon className="size-3.5 text-gold" aria-hidden />
            {pill.label}
          </span>
          <span className="mt-1 block font-display text-xl font-semibold leading-none">{pill.value}</span>
        </button>
      ))}
    </div>
  );
}

function Camp({ flags }: { flags: PublicFlags }) {
  const name = useQuiz((s) => s.name);
  const age = useQuiz((s) => s.age);
  const difficulty = useQuiz((s) => s.difficulty);
  const challenge = useQuiz((s) => s.challenge);
  const round = useQuiz((s) => s.round);
  const setName = useQuiz((s) => s.setName);
  const setAge = useQuiz((s) => s.setAge);
  const setDifficulty = useQuiz((s) => s.setDifficulty);
  const setChallenge = useQuiz((s) => s.setChallenge);
  const begin = useQuiz((s) => s.begin);

  return (
    <section className="grid items-start gap-6 lg:grid-cols-[1.15fr_.85fr]">
      <div className="order-2 border-t-4 border-gold pt-5 lg:order-1">
        <p className="text-sm font-extrabold uppercase tracking-widest text-gold">Expedition</p>
        <h1 className="mt-2 font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Little minds.
          <br />
          A brighter trail.
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
          Twelve lands, spelling, brain breaks, a daily challenge, and a Year 1 academy. Sign in and the same stars —
          and an unfinished question — follow you to another device.
        </p>
        <Inbox />
        <InstallButton />
      </div>
      <form
        className="order-1 rounded-card border border-line bg-surface p-5 lg:order-2"
        onSubmit={(event) => {
          event.preventDefault();
          begin();
        }}
      >
        <label className="block text-sm font-extrabold uppercase tracking-wide text-muted" htmlFor="explorer">
          Explorer name
        </label>
        <input
          id="explorer"
          value={name}
          maxLength={24}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          className="mt-2 w-full rounded-2xl border border-line bg-surface-2 px-4 py-3 text-lg font-bold text-fg"
        />
        <fieldset className="mt-5">
          <legend className="text-sm font-extrabold uppercase tracking-wide text-muted">Level</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {AGES.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={age === item.id}
                onClick={() => setAge(item.id)}
                className={cn(
                  "min-h-11 rounded-2xl border px-3 py-3 text-left font-extrabold",
                  age === item.id ? "border-gold bg-surface-2 text-fg" : "border-line text-muted",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-muted">{AGES.find((item) => item.id === age)?.note}</p>
        </fieldset>
        <fieldset className="mt-5">
          <legend className="text-sm font-extrabold uppercase tracking-wide text-muted">Difficulty</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {LEVELS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={difficulty === item.id}
                onClick={() => setDifficulty(item.id)}
                className={cn(
                  "min-h-11 rounded-2xl border px-2 py-3 font-extrabold",
                  difficulty === item.id ? "border-primary bg-primary text-primary-fg" : "border-line text-muted",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          {difficulty === "advanced" && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {ADVANCED_MODES.map((mode, index) => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={challenge === mode}
                  onClick={() => setChallenge(mode)}
                  className={cn(
                    "stagger-item min-h-11 rounded-2xl border px-3 py-2 text-left text-sm font-extrabold",
                    challenge === mode ? "border-gold bg-surface-2 text-fg" : "border-line text-muted",
                  )}
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  {mode}
                </button>
              ))}
            </div>
          )}
          <p className="mt-2 text-sm text-muted">
            {LEVELS.find((item) => item.id === difficulty)?.note}
            {difficulty === "advanced" && challenge ? ` Selected: ${challenge}.` : ""}
            {age === "young" && difficulty === "difficult"
              ? " Ages 5–7 use the harder bank when a warm-up set has no difficult questions."
              : ""}
          </p>
        </fieldset>
        <ResumeCard />
        {!flags.registrationsEnabled && (
          <p className="mt-3 text-sm text-muted">New accounts are paused. Explorers who already have an account can still sign in.</p>
        )}
        <button
          type="submit"
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-primary px-4 py-3 text-lg font-extrabold text-primary-fg"
        >
          {round ? "Open this question" : "Set out"}
        </button>
      </form>
    </section>
  );
}

function Trail({ flags }: { flags: PublicFlags }) {
  const name = useQuiz((s) => s.name);
  const landDone = useQuiz((s) => s.landDone);
  const landCorrect = useQuiz((s) => s.landCorrect);
  const totalStars = useQuiz((s) => s.totalStars);
  const startLand = useQuiz((s) => s.startLand);
  const go = useQuiz((s) => s.go);
  const cleared = lands.filter((land) => landDone[land.id]).length;

  const shortcuts: { label: string; icon: LucideIcon; screen: "daily" | "academy" | "badges" | "board" | "battle" }[] = [
    ...(flags.featureDaily ? [{ label: "Daily", icon: CalendarDays, screen: "daily" as const }] : []),
    ...(flags.featureAcademy ? [{ label: "Academy", icon: BookOpen, screen: "academy" as const }] : []),
    { label: "Badges", icon: Award, screen: "badges" },
    { label: "Board", icon: Trophy, screen: "board" },
    ...(flags.featureBattle ? [{ label: "Online", icon: Wifi, screen: "battle" as const }] : []),
  ];

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-widest text-gold">{name}</p>
          <h2 className="font-display text-3xl font-semibold">The trail</h2>
          <p className="text-muted">
            {cleared} of {lands.length} lands cleared · {totalStars} {totalStars === 1 ? "star" : "stars"}
          </p>
        </div>
        <Stats />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {shortcuts.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => go(item.screen)}
            className="stagger-item inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-line bg-surface font-extrabold"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <item.icon className="size-4 text-gold" aria-hidden />
            {item.label}
          </button>
        ))}
      </div>
      <ResumeCard />
      <Duel />
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {lands
          .filter((land) => (land.id === "news" ? flags.featureNews : land.id === "sports" ? flags.featureSports : true))
          .map((land) => {
          const Icon = LAND_ICONS[land.id] ?? Map;
          const best = landCorrect[land.id] ?? 0;
          const done = !!landDone[land.id];
          return (
            <button
              key={land.id}
              type="button"
              onClick={() => startLand(land.id)}
              className={cn(
                "land-card rounded-card border bg-surface p-4 text-left",
                done ? "border-gold" : "border-line",
              )}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-surface-2 text-gold">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="text-sm font-extrabold text-muted">
                  {done ? "Cleared" : "Open"} · {best}/{land.count}
                </span>
              </span>
              <span className="mt-3 block font-display text-xl font-semibold">{land.name}</span>
              <span className="mt-1 block text-sm text-muted">
                {land.mode === "spelling" ? "Spell the word you hear." : "Ten questions. Lives on the line."}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Duel() {
  const startBattle = useQuiz((s) => s.startBattle);
  const [open, setOpen] = useState(false);
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-line bg-surface font-extrabold"
      >
        <Swords className="size-4 text-gold" aria-hidden />
        Pass-and-play duel
      </button>
    );
  }

  return (
    <form
      className="mt-4 grid gap-3 rounded-card border border-line bg-surface p-4 sm:grid-cols-[1fr_1fr_auto]"
      onSubmit={(event) => {
        event.preventDefault();
        startBattle(p1, p2);
      }}
    >
      <input
        value={p1}
        onChange={(event) => setP1(event.target.value)}
        placeholder="Player one"
        aria-label="Player one"
        className="min-h-11 rounded-2xl border border-line bg-surface-2 px-3 font-bold text-fg"
      />
      <input
        value={p2}
        onChange={(event) => setP2(event.target.value)}
        placeholder="Player two"
        aria-label="Player two"
        className="min-h-11 rounded-2xl border border-line bg-surface-2 px-3 font-bold text-fg"
      />
      <button type="submit" className="min-h-11 rounded-2xl bg-gold px-4 font-extrabold text-gold-fg">
        Start duel
      </button>
    </form>
  );
}

function Play() {
  const round = useQuiz((s) => s.round);
  const voiceOn = useQuiz((s) => s.voiceOn);
  const answerChoice = useQuiz((s) => s.answerChoice);
  const submitSpell = useQuiz((s) => s.submitSpell);
  const next = useQuiz((s) => s.next);
  const battlePick = useQuiz((s) => s.battlePick);
  const battleAdvance = useQuiz((s) => s.battleAdvance);
  const [draft, setDraft] = useState("");

  const item = round?.items[round.index];

  useEffect(() => {
    setDraft("");
  }, [round?.index, round?.mode]);

  useEffect(() => {
    if (!voiceOn || !item || round?.revealed) return;
    if (item.kind === "spell") speak(item.word);
  }, [voiceOn, item, round?.index, round?.revealed, round?.phase]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (!round || !item || item.kind !== "choice") return;
      const n = Number(event.key);
      if (n < 1 || n > item.opts.length) return;
      if (round.mode === "battle") battlePick(n - 1);
      else if (!round.revealed) answerChoice(n - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [round, item, answerChoice, battlePick]);

  if (!round || !item) {
    return <p className="text-muted">The trail is quiet. Head back and pick a land.</p>;
  }

  if (round.mode === "battle" && round.phase === "pass") {
    return (
      <section className="mx-auto max-w-xl rounded-card border border-line bg-surface p-6 text-center">
        <p className="text-sm font-extrabold uppercase tracking-widest text-gold">Pass the device</p>
        <h2 className="mt-2 font-display text-3xl font-semibold">{round.p2Name}, you are up</h2>
        <p className="mt-2 text-muted">Do not peek at the first answer.</p>
        <button
          type="button"
          onClick={battleAdvance}
          className="mt-6 min-h-12 w-full rounded-2xl bg-primary font-extrabold text-primary-fg"
        >
          I am ready
        </button>
      </section>
    );
  }

  const progress = ((round.index + (round.revealed ? 1 : 0)) / round.items.length) * 100;
  const asking =
    round.mode === "battle"
      ? round.phase === "p2"
        ? round.p2Name
        : round.p1Name
      : null;

  return (
    <section className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between gap-3 text-sm font-extrabold text-muted">
        <span>{round.title}</span>
        <span>
          {round.index + 1} / {round.items.length}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2" aria-hidden>
        <div className="progress-fill h-full bg-gold" style={{ width: `${progress}%` }} />
      </div>
      {round.mode !== "battle" && round.mode !== "daily" && round.mode !== "academy" && (
        <div className="mt-4">
          <Stats />
        </div>
      )}
      {asking && <p className="mt-4 text-sm font-extrabold uppercase tracking-widest text-gold">{asking}</p>}
      {item.kind === "choice" ? (
        <ChoiceCard
          item={item}
          round={round}
          voiceOn={voiceOn}
          onPick={(index) => (round.mode === "battle" ? battlePick(index) : answerChoice(index))}
        />
      ) : (
        <form
          className="mt-6"
          onSubmit={(event) => {
            event.preventDefault();
            if (!round.revealed) submitSpell(draft);
          }}
        >
          <h2 className="font-display text-3xl font-semibold leading-tight">Spell the word</h2>
          <p className="mt-2 text-muted">{item.hint}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => speak(item.word)}
              className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-line px-4 font-extrabold"
            >
              <Volume2 className="size-4" aria-hidden />
              Hear it
            </button>
          </div>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Your spelling"
            disabled={round.revealed}
            className="mt-4 w-full rounded-2xl border border-line bg-surface px-4 py-3 text-2xl font-bold text-fg"
          />
          {round.revealed && (
            <p className={cn("mt-3 font-extrabold", draft.trim().toLowerCase() === item.word.toLowerCase() ? "text-good" : "text-bad")}>
              {draft.trim().toLowerCase() === item.word.toLowerCase() ? "Correct." : `The spelling is ${item.word}.`}
            </p>
          )}
          {!round.revealed && (
            <button type="submit" className="mt-4 min-h-12 w-full rounded-2xl bg-primary font-extrabold text-primary-fg">
              Check spelling
            </button>
          )}
        </form>
      )}
      {round.revealed && round.mode !== "battle" && (
        <button
          type="button"
          onClick={next}
          className="mt-4 min-h-12 w-full rounded-2xl bg-gold font-extrabold text-gold-fg"
        >
          {round.index === round.items.length - 1 ? "Finish" : "Next question"}
        </button>
      )}
      {round.mode === "battle" && round.phase === "reveal" && item.kind === "choice" && (
        <div className="mt-4">
          <p className="text-muted">
            {round.p1Name} {round.p1Pick === item.a ? "correct" : "missed"} · {round.p2Name}{" "}
            {round.picks[round.index] === item.a ? "correct" : "missed"}
          </p>
          <p className="mt-1 font-extrabold">
            {round.p1Score} — {round.p2Score}
          </p>
          <button
            type="button"
            onClick={battleAdvance}
            className="mt-4 min-h-12 w-full rounded-2xl bg-gold font-extrabold text-gold-fg"
          >
            {round.index === round.items.length - 1 ? "See the result" : "Next round"}
          </button>
        </div>
      )}
    </section>
  );
}

function ChoiceCard({
  item,
  round,
  voiceOn,
  onPick,
}: {
  item: Extract<PlayItem, { kind: "choice" }>;
  round: Round;
  voiceOn: boolean;
  onPick: (index: number) => void;
}) {
  const locked = round.mode === "battle" ? round.phase === "reveal" || round.phase === "pass" : round.revealed;
  const picked = round.mode === "battle" && round.phase === "reveal" ? round.picks[round.index] : round.picks[round.index];

  return (
    <div className="mt-6">
      {item.media && item.media.items.length > 0 && (
        <div className="mb-4 rounded-card border border-line bg-surface p-4">
          <p className="text-sm font-extrabold text-muted">{item.media.title}</p>
          <ul className="mt-3 space-y-2">
            {item.media.items.map(([label, value]) => {
              const max = Math.max(...item.media!.items.map((row) => Number(row[1]) || 0), 1);
              return (
                <li key={label}>
                  <div className="mb-1 flex justify-between text-sm font-bold">
                    <span>{label}</span>
                    <span className="text-muted">{value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(Number(value) / max) * 100}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-3xl font-semibold leading-tight">{item.q}</h2>
        {voiceOn && (
          <button
            type="button"
            onClick={() => speak(item.q)}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl border border-line"
            aria-label="Hear the question"
          >
            <Volume2 className="size-5" />
          </button>
        )}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {item.opts.map((option, index) => {
          const hidden = item.hidden.includes(index);
          const isPick = picked === index;
          const show = locked && round.mode !== "battle" ? true : round.mode === "battle" && round.phase === "reveal";
          const correct = show && index === item.a;
          const wrongPick = show && isPick && index !== item.a;
          return (
            <button
              key={`${item.id}-${index}`}
              type="button"
              disabled={hidden || locked}
              onClick={() => onPick(index)}
              className={cn(
                "stagger-item flex min-h-14 items-center gap-3 rounded-2xl border px-4 py-3 text-left text-lg font-extrabold",
                hidden && "invisible",
                correct && "border-good bg-surface-2 text-good",
                wrongPick && "border-bad text-bad",
                !correct && !wrongPick && "border-line bg-surface",
              )}
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <span className="text-muted">{String.fromCharCode(65 + index)}</span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>
      {round.revealed && round.mode !== "battle" && item.exp && (
        <p className="mt-4 rounded-2xl border border-line bg-surface-2 px-4 py-3 leading-relaxed text-muted">{item.exp}</p>
      )}
    </div>
  );
}

function Shop() {
  const coins = useQuiz((s) => s.coins);
  const lives = useQuiz((s) => s.lives);
  const hints = useQuiz((s) => s.hints);
  const shopForced = useQuiz((s) => s.shopForced);
  const buyLife = useQuiz((s) => s.buyLife);
  const refillHints = useQuiz((s) => s.refillHints);
  const openBonus = useQuiz((s) => s.openBonus);
  const abandon = useQuiz((s) => s.abandon);
  const go = useQuiz((s) => s.go);

  return (
    <section className="mx-auto max-w-xl">
      <h2 className="font-display text-3xl font-semibold">{shopForced ? "Out of lives" : "Camp shop"}</h2>
      <p className="mt-2 text-muted">
        {shopForced
          ? "Buy a life, earn one with a bonus question, or leave this land."
          : "Lives cost 10 coins. A full set of hints costs 20."}
      </p>
      <div className="mt-4">
        <Stats />
      </div>
      <div className="mt-4 grid gap-3">
        <button
          type="button"
          disabled={lives >= 3 || coins < 10}
          onClick={buyLife}
          className="min-h-14 rounded-2xl bg-primary px-4 text-left font-extrabold text-primary-fg disabled:opacity-45"
        >
          <Heart className="mr-2 inline size-4" aria-hidden />
          Buy a life · 10 coins
        </button>
        <button
          type="button"
          disabled={hints >= 3 || coins < 20}
          onClick={refillHints}
          className="min-h-14 rounded-2xl border border-line bg-surface px-4 text-left font-extrabold disabled:opacity-45"
        >
          <Lightbulb className="mr-2 inline size-4 text-gold" aria-hidden />
          Refill hints · 20 coins
        </button>
        {shopForced && (
          <button
            type="button"
            onClick={openBonus}
            className="min-h-14 rounded-2xl bg-gold px-4 text-left font-extrabold text-gold-fg"
          >
            Bonus question for a life
          </button>
        )}
        {shopForced ? (
          <button type="button" onClick={abandon} className="min-h-12 rounded-2xl border border-line font-extrabold">
            Leave this land
          </button>
        ) : (
          <button type="button" onClick={() => go("map")} className="min-h-12 rounded-2xl border border-line font-extrabold">
            Back to the trail
          </button>
        )}
      </div>
    </section>
  );
}

function Bonus() {
  const bonus = useQuiz((s) => s.bonus);
  const bonusPick = useQuiz((s) => s.bonusPick);
  const bonusRevealed = useQuiz((s) => s.bonusRevealed);
  const answerBonus = useQuiz((s) => s.answerBonus);
  const leaveBonus = useQuiz((s) => s.leaveBonus);
  if (!bonus || bonus.kind !== "choice") return null;
  return (
    <section className="mx-auto max-w-3xl">
      <p className="text-sm font-extrabold uppercase tracking-widest text-gold">Bonus</p>
      <h2 className="mt-2 font-display text-3xl font-semibold leading-tight">{bonus.q}</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {bonus.opts.map((option, index) => {
          const correct = bonusRevealed && index === bonus.a;
          const wrong = bonusRevealed && bonusPick === index && index !== bonus.a;
          return (
            <button
              key={option}
              type="button"
              disabled={bonusRevealed}
              onClick={() => answerBonus(index)}
              className={cn(
                "min-h-14 rounded-2xl border px-4 py-3 text-left text-lg font-extrabold",
                correct && "border-good text-good",
                wrong && "border-bad text-bad",
                !correct && !wrong && "border-line bg-surface",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
      {bonusRevealed && (
        <button
          type="button"
          onClick={leaveBonus}
          className="mt-4 min-h-12 w-full rounded-2xl bg-gold font-extrabold text-gold-fg"
        >
          Continue
        </button>
      )}
    </section>
  );
}

function Break() {
  const card = useQuiz((s) => s.breakCard);
  const shown = useQuiz((s) => s.breakShown);
  const revealBreak = useQuiz((s) => s.revealBreak);
  const continueBreak = useQuiz((s) => s.continueBreak);
  if (!card) return null;
  return (
    <section className="mx-auto max-w-xl rounded-card border border-line bg-surface p-6">
      <p className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest text-gold">
        <Tent className="size-4" aria-hidden />
        Brain break
      </p>
      <h2 className="mt-3 font-display text-3xl font-semibold leading-tight">{card.text}</h2>
      {shown ? (
        <p className="mt-4 leading-relaxed text-muted">{card.answer}</p>
      ) : (
        <button
          type="button"
          onClick={revealBreak}
          className="mt-6 min-h-12 w-full rounded-2xl bg-primary font-extrabold text-primary-fg"
        >
          Show the answer · 3 coins
        </button>
      )}
      <button
        type="button"
        onClick={continueBreak}
        className="mt-3 min-h-12 w-full rounded-2xl border border-line font-extrabold"
      >
        Onward
      </button>
    </section>
  );
}

function Badges() {
  const earned = useQuiz((s) => s.badges);
  const best = useQuiz((s) => s.bestStreak);
  return (
    <section>
      <h2 className="font-display text-3xl font-semibold">Badges</h2>
      <p className="mt-1 text-muted">Best streak on this device: {best}.</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {BADGES.map((badge) => {
          const has = earned.includes(badge.id);
          return (
            <li key={badge.id} className={cn("rounded-card border p-4", has ? "border-gold bg-surface" : "border-line")}>
              <p className="flex items-center gap-2 font-extrabold">
                <Award className={cn("size-4", has ? "text-gold" : "text-muted")} aria-hidden />
                {badge.name}
              </p>
              <p className="mt-1 text-sm text-muted">{has ? badge.detail : "Still locked."}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Daily() {
  const dailyDone = useQuiz((s) => s.dailyDone);
  const dailyDate = useQuiz((s) => s.dailyDate);
  const dailyScore = useQuiz((s) => s.dailyScore);
  const startDaily = useQuiz((s) => s.startDaily);
  const done = dailyDone && dailyDate === todayKey();
  return (
    <section className="mx-auto max-w-xl">
      <p className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest text-gold">
        <CalendarDays className="size-4" aria-hidden />
        Today
      </p>
      <h2 className="mt-2 font-display text-3xl font-semibold">Daily challenge</h2>
      <p className="mt-2 leading-relaxed text-muted">
        Five questions, seeded for this calendar day. Finish them for 75 coins. Lives stay out of it.
      </p>
      {done ? (
        <p className="mt-4 rounded-2xl border border-gold bg-surface px-4 py-3 font-extrabold">
          Done for today. Score {dailyScore} of 5. Come back tomorrow.
        </p>
      ) : (
        <button
          type="button"
          onClick={startDaily}
          className="mt-6 min-h-12 w-full rounded-2xl bg-primary font-extrabold text-primary-fg"
        >
          Begin today
        </button>
      )}
    </section>
  );
}

function Board() {
  const board = useQuiz((s) => s.board);
  return (
    <section className="mx-auto max-w-xl">
      <h2 className="font-display text-3xl font-semibold">Device board</h2>
      <p className="mt-2 text-muted">Names are saved on this device when the full trail is finished.</p>
      {board.length === 0 ? (
        <p className="mt-6 rounded-card border border-line bg-surface p-4 text-muted">No completed trails yet.</p>
      ) : (
        <ol className="mt-4 space-y-2">
          {board.map((row, index) => (
            <li key={`${row.name}-${row.at}`} className="flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3">
              <span className="font-extrabold">
                {index + 1}. {row.name}
              </span>
              <span className="text-muted">
                {row.stars} stars · {row.coins} coins
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function Academy() {
  const startAcademy = useQuiz((s) => s.startAcademy);
  const subjects = academySubjects();
  return (
    <section>
      <p className="text-sm font-extrabold uppercase tracking-widest text-gold">Year 1 pilot</p>
      <h2 className="mt-1 font-display text-3xl font-semibold">Academy</h2>
      <p className="mt-2 max-w-2xl text-muted">
        A first bank for Nigerian primary Year 1 — maths, English, basic science, health, and creative arts. Six
        questions a sitting. No lives lost.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {subjects.map((subject) => (
          <button
            key={subject.subject}
            type="button"
            onClick={() => startAcademy(subject.subject)}
            className="rounded-card border border-line bg-surface p-4 text-left"
          >
            <span className="block font-display text-xl font-semibold">{subject.subject}</span>
            <span className="mt-1 block text-sm text-muted">{subject.count} questions in the bank</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function Summary() {
  const note = useQuiz((s) => s.summaryNote);
  const park = useQuiz((s) => s.park);
  return (
    <section className="mx-auto max-w-xl rounded-card border border-gold bg-surface p-6 text-center">
      <Trophy className="mx-auto size-8 text-gold" aria-hidden />
      <h2 className="mt-3 font-display text-3xl font-semibold">Result</h2>
      <p className="mt-3 text-lg leading-relaxed">{note}</p>
      <button
        type="button"
        onClick={() => park("map")}
        className="mt-6 min-h-12 w-full rounded-2xl bg-primary font-extrabold text-primary-fg"
      >
        Back to the trail
      </button>
    </section>
  );
}

function Certificate() {
  const name = useQuiz((s) => s.name);
  const totalStars = useQuiz((s) => s.totalStars);
  const coins = useQuiz((s) => s.coins);
  const bestStreak = useQuiz((s) => s.bestStreak);
  const park = useQuiz((s) => s.park);
  return (
    <section className="mx-auto max-w-xl rounded-card border-4 border-gold bg-surface p-8 text-center">
      <p className="text-sm font-extrabold uppercase tracking-widest text-gold">Quizy expedition</p>
      <h2 className="mt-2 font-display text-4xl font-semibold">Trail certificate</h2>
      <p className="mt-4 text-lg">
        This certifies that <span className="font-extrabold">{name}</span> cleared every land.
      </p>
      <p className="mt-2 text-muted">
        {totalStars} stars · {coins} coins · best streak {bestStreak}
      </p>
      <p className="mt-2 text-sm text-muted">{todayKey()}</p>
      <button
        type="button"
        onClick={() => park("map")}
        className="mt-6 min-h-12 w-full rounded-2xl bg-gold font-extrabold text-gold-fg"
      >
        Return to camp trail
      </button>
    </section>
  );
}
