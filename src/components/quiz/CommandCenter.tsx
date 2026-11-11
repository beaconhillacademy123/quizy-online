import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { commandCall, listFeedback, useQuizSession, type CommandSettings, type CommandSummary, type CommandUser } from "@/lib/quiz/cloud";

const TEMPLATES: Record<string, [string, string]> = {
  praise: [
    "Outstanding Explorer",
    "I see the effort you are putting into Quizy. Your consistency, progress and determination have not gone unnoticed. Keep exploring, keep learning and keep earning those badges.",
  ],
  badge: ["Badge Hunter", "Congratulations on the badges you are earning. Keep exploring. More discoveries are waiting."],
  streak: ["Streak Champion", "Your consistency is impressive. Keep coming back, keep challenging yourself and protect that streak."],
  encourage: ["Keep Exploring", "Keep trying, keep improving and never be afraid of a difficult question. You are doing well."],
};

const SWITCHES: [keyof CommandSettings, string][] = [
  ["maintenance_mode", "Maintenance"],
  ["registrations_enabled", "New accounts"],
  ["feature_battle", "Online and Bluetooth battle"],
  ["feature_current_affairs", "Current affairs"],
  ["feature_sports", "Sports arena"],
  ["feature_daily_challenge", "Daily challenge"],
  ["music_enabled", "Background music flag"],
  ["force_update", "Force update"],
];

export function CommandCenter() {
  const { user, pending } = useQuizSession();
  const [summary, setSummary] = useState<CommandSummary | null>(null);
  const [explorers, setExplorers] = useState<CommandUser[]>([]);
  const [settings, setSettings] = useState<CommandSettings | null>(null);
  const [notes, setNotes] = useState<{ id: string; comment: string | null }[]>([]);
  const [picked, setPicked] = useState<string[]>([]);
  const [subject, setSubject] = useState("Keep exploring");
  const [body, setBody] = useState("");
  const [feedback, setFeedback] = useState<{ kind: "success" | "warning" | "error"; message: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [reason, setReason] = useState("Command Center action");

  useEffect(() => {
    if (!feedback || sending) return;
    const timer = window.setTimeout(() => {
      setFeedback((current) => (current === feedback ? null : current));
    }, 6000);
    return () => window.clearTimeout(timer);
  }, [feedback, sending]);

  function refresh() {
    setFeedback(null);
    Promise.all([
      commandCall<CommandSummary>("summary"),
      commandCall<{ users: CommandUser[] }>("users"),
      commandCall<{ settings: CommandSettings }>("settings"),
      listFeedback(),
    ])
      .then(([nextSummary, nextUsers, nextSettings, nextNotes]) => {
        setSummary(nextSummary);
        setExplorers(nextUsers.users ?? []);
        setSettings(nextSettings.settings);
        setNotes(nextNotes);
      })
      .catch((caught: unknown) => setFeedback({ kind: "error", message: caught instanceof Error ? caught.message : "Command Center is closed" }));
  }

  useEffect(() => {
    if (user) refresh();
  }, [user?.id]);

  if (pending) return <p className="text-muted">Checking the owner session…</p>;
  if (!user) {
    return (
      <section className="mx-auto max-w-xl">
        <h2 className="font-display text-3xl font-semibold">Command Center</h2>
        <p className="mt-2 text-muted">Sign in with the Quizy owner account. This stays inside that account.</p>
        <Link to="/login" className="mt-4 inline-flex min-h-12 items-center rounded-2xl bg-primary px-5 font-extrabold text-primary-fg">
          Sign in
        </Link>
      </section>
    );
  }
  if (feedback?.kind === "error" && !summary) return <p className="text-bad">{feedback.message}</p>;
  if (!summary || !settings) return <p className="text-muted">Opening the Command Center…</p>;

  function save(next: CommandSettings) {
    setSettings(next);
    commandCall("save_settings", { settings: next })
      .then(() => setFeedback({ kind: "success", message: "Switches saved." }))
      .catch((caught: unknown) => setFeedback({ kind: "error", message: caught instanceof Error ? caught.message : "Could not save" }));
  }

  return (
    <section className="space-y-4">
      {feedback && (
        <div
          role={feedback.kind === "error" ? "alert" : "status"}
          aria-live={feedback.kind === "error" ? "assertive" : "polite"}
          className={`fixed left-4 right-4 top-[calc(env(safe-area-inset-top)+1rem)] z-[100] mx-auto flex max-w-2xl items-start justify-between gap-4 rounded-2xl border px-4 py-3 shadow-xl ${
            feedback.kind === "error"
              ? "border-bad bg-surface text-bad"
              : feedback.kind === "warning"
                ? "border-gold bg-surface text-fg"
                : "border-primary bg-surface text-fg"
          }`}
        >
          <p className="font-bold">{feedback.message}</p>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setFeedback(null)}
            className="shrink-0 rounded-lg px-2 font-bold"
          >
            ×
          </button>
        </div>
      )}
      <div>
        <p className="text-sm font-extrabold uppercase tracking-widest text-gold">Owner</p>
        <h2 className="font-display text-3xl font-semibold">Command Center</h2>
        <p className="text-muted">Explorers, messages and switches from the existing Quizy command service. Email addresses stay masked.</p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {(
          [
            ["Explorers", summary.registered_users],
            ["Installs", summary.detected_installations],
            ["Active today", summary.daily_active],
            ["Played today", summary.daily_players],
            ["Answers today", summary.questions_answered],
            ["Badges held", summary.badges_earned],
          ] as const
        ).map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-line bg-surface p-3">
            <p className="text-xs font-extrabold uppercase tracking-wide text-muted">{label}</p>
            <p className="font-display text-3xl font-semibold">{value ?? 0}</p>
          </div>
        ))}
      </div>
      <div className="rounded-card border border-line bg-surface p-4">
        <h3 className="font-extrabold">Switches</h3>
        {SWITCHES.map(([key, label]) => (
          <label key={key} className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
            <span>{label}</span>
            <input
              type="checkbox"
              checked={Boolean(settings[key])}
              onChange={(event) => save({ ...settings, [key]: event.target.checked })}
            />
          </label>
        ))}
        <label className="mt-3 block text-sm text-muted" htmlFor="version">
          Minimum app version
        </label>
        <input
          id="version"
          defaultValue={settings.min_app_version || "2.2.1"}
          className="mt-1 min-h-11 w-full rounded-2xl border border-line bg-surface-2 px-3 font-bold text-fg"
          onBlur={(event) => {
            if (event.target.value === settings.min_app_version) return;
            save({ ...settings, min_app_version: event.target.value });
          }}
        />
        <label className="mt-3 block text-sm text-muted" htmlFor="announce">
          Announcement
        </label>
        <textarea
          id="announce"
          defaultValue={settings.announcement ?? ""}
          rows={3}
          className="mt-1 w-full rounded-2xl border border-line bg-surface-2 px-3 py-2 text-fg"
          onBlur={(event) => {
            const next = event.target.value.trim() || null;
            if (next === settings.announcement) return;
            save({ ...settings, announcement: next });
          }}
        />
      </div>
      <form
        className="rounded-card border border-line bg-surface p-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (sending) return;
          if (picked.length === 0) {
            setFeedback({ kind: "error", message: "Choose at least one explorer." });
            return;
          }
          if (!subject.trim() || !body.trim()) {
            setFeedback({ kind: "error", message: "Subject and message are required." });
            return;
          }
          setSending(true);
          setFeedback({ kind: "warning", message: "Sending your message…" });
          commandCall<{
            sent_count?: number;
            email_sent_count?: number;
            email_failed_count?: number;
            email_status?: string;
          }>("send_message", {
            user_ids: picked,
            subject,
            message: body,
            email_requested: true,
            sender_name: "Quizy Expedition Commander",
          })
            .then((result) => {
              setBody("");
              const emailFailed = (result.email_failed_count ?? 0) > 0;
              const emailStatus = result.email_status ? ` ${result.email_status}` : "";
              setFeedback({
                kind: emailFailed ? "warning" : "success",
                message: `Delivered inside Quizy to ${result.sent_count ?? picked.length} explorer(s).${emailStatus}`,
              });
            })
            .catch((caught: unknown) =>
              setFeedback({ kind: "error", message: caught instanceof Error ? caught.message : "Message failed" }),
            )
            .finally(() => setSending(false));
        }}
      >
        <h3 className="font-extrabold">Message explorers</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(TEMPLATES).map(([id, [title, message]]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setSubject(title);
                setBody(message);
              }}
              className="min-h-11 rounded-2xl border border-line px-3 text-sm font-extrabold"
            >
              {title}
            </button>
          ))}
        </div>
        <input
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          className="mt-3 min-h-11 w-full rounded-2xl border border-line bg-surface-2 px-3 font-bold text-fg"
        />
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={5}
          className="mt-2 w-full rounded-2xl border border-line bg-surface-2 px-3 py-2 text-fg"
        />
        <ul className="mt-3 max-h-48 space-y-1 overflow-auto">
          {explorers.map((explorer) => (
            <li key={explorer.user_id}>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={picked.includes(explorer.user_id)}
                  onChange={(event) =>
                    setPicked((current) =>
                      event.target.checked ? [...current, explorer.user_id] : current.filter((id) => id !== explorer.user_id),
                    )
                  }
                />
                <span className="font-extrabold">{explorer.display_name}</span>
                <span className="text-sm text-muted">
                  {explorer.email_masked} · {explorer.total_stars} stars · {explorer.suspended ? "suspended" : "active"}
                </span>
              </label>
            </li>
          ))}
        </ul>
        <button type="submit" disabled={sending} className="mt-3 min-h-11 rounded-2xl bg-gold px-4 font-extrabold text-gold-fg disabled:cursor-wait disabled:opacity-60">
          {sending ? "Sending…" : "Send"}
        </button>
      </form>
      <div className="rounded-card border border-line bg-surface p-4">
        <h3 className="font-extrabold">Explorer access</h3>
        <label className="mt-2 block text-sm text-muted" htmlFor="reason">
          Reason for a suspension
        </label>
        <input
          id="reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          className="mt-1 min-h-11 w-full rounded-2xl border border-line bg-surface-2 px-3 text-fg"
        />
        <ul className="mt-3 space-y-2">
          {explorers.map((explorer) => (
            <li key={explorer.user_id} className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2">
              <span>
                {explorer.display_name}
                <span className="text-muted"> · last active {explorer.last_active ? new Date(explorer.last_active).toLocaleString() : "—"}</span>
              </span>
              <button
                type="button"
                onClick={() =>
                  commandCall("user_action", {
                    user_id: explorer.user_id,
                    action: explorer.suspended ? "restore" : "suspend",
                    reason,
                  })
                    .then(() => refresh())
                    .catch((caught: unknown) => setFeedback({ kind: "error", message: caught instanceof Error ? caught.message : "Could not update the explorer" }))
                }
                className="min-h-11 rounded-2xl border border-line px-3 font-extrabold"
              >
                {explorer.suspended ? "Restore" : "Suspend"}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-card border border-line bg-surface p-4">
        <h3 className="font-extrabold">Feedback</h3>
        {notes.length === 0 && <p className="mt-2 text-muted">No notes yet.</p>}
        <ul className="mt-2 space-y-3">
          {notes.map((item) => (
            <li key={item.id} className="text-muted">
              {item.comment}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
