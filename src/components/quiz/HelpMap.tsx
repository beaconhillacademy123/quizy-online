import { useState } from "react";
import {
  BookOpen,
  Compass,
  Lightbulb,
  ScrollText,
  Sparkles,
  Tent,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { sendFeedback, useQuizSession } from "@/lib/quiz/cloud";

const PINS = [
  { id: "play", title: "How to play", detail: "Explorer's camp", icon: Tent },
  { id: "library", title: "Learning guide", detail: "Knowledge library", icon: BookOpen },
  { id: "problem", title: "Report a problem", detail: "Fix-it workshop", icon: Wrench },
  { id: "idea", title: "Send an idea", detail: "Idea island", icon: Lightbulb },
  { id: "family", title: "Safety and parents", detail: "Family village", icon: Users },
  { id: "new", title: "What's new", detail: "Discovery observatory", icon: Sparkles },
  { id: "terms", title: "Terms and privacy", detail: "Scroll temple", icon: ScrollText },
] as const;

type Pin = (typeof PINS)[number]["id"] | "home";

export function HelpMap({ onClose }: { onClose: () => void }) {
  const [pin, setPin] = useState<Pin>("home");
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-bg/90 p-3 backdrop-blur-sm">
      <div className="screen-in max-h-[92vh] w-full max-w-2xl overflow-auto rounded-card border border-line bg-surface p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest text-gold">
              <Compass className="size-4" aria-hidden />
              Help map
            </p>
            <h2 className="font-display text-3xl font-semibold">Lost or curious?</h2>
          </div>
          <button type="button" aria-label="Close help map" onClick={onClose} className="inline-flex size-11 items-center justify-center rounded-2xl border border-line">
            <X className="size-5" />
          </button>
        </div>
        {pin === "home" ? (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {PINS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPin(item.id)}
                className="stagger-item flex min-h-16 items-center gap-3 rounded-2xl border border-line bg-surface-2 px-3 text-left"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <item.icon className="size-5 shrink-0 text-gold" aria-hidden />
                <span>
                  <span className="block font-extrabold">{item.title}</span>
                  <span className="block text-sm text-muted">{item.detail}</span>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <Destination id={pin} onBack={() => setPin("home")} />
        )}
      </div>
    </div>
  );
}

function Destination({ id, onBack }: { id: Exclude<Pin, "home">; onBack: () => void }) {
  return (
    <div className="screen-in mt-4 space-y-3 text-muted">
      <button type="button" onClick={onBack} className="font-extrabold text-gold">
        Back to the map
      </button>
      {id === "play" && (
        <>
          <h3 className="font-display text-2xl font-semibold text-fg">How to play</h3>
          <p>Choose a land. Read the question. Answer. The explanation is part of the adventure, even when you miss.</p>
          <p>Lives drop on a miss inside a land. Hints remove two wrong choices. Coins buy a life or a fresh set of hints. A brain break waits at the end of each land.</p>
          <p>Sign in if you want the same trail on another device, including a question you have not finished.</p>
        </>
      )}
      {id === "library" && (
        <>
          <h3 className="font-display text-2xl font-semibold text-fg">Learning guide</h3>
          <p>Ages 5–7 and 8–10 see different questions. Easy is a warm-up. Medium asks you to think. Difficult is a real challenge. Advanced — Beast through Volcano — uses the harder add-on bank.</p>
          <p>Academy is a Year 1 pilot: maths, English, basic science, health, and creative arts. Daily challenge is five questions, once each calendar day.</p>
        </>
      )}
      {id === "problem" && <NoteForm kind="problem" title="Report a problem" prompt="What happened, and which land were you in?" />}
      {id === "idea" && <NoteForm kind="idea" title="Send an idea" prompt="What would make Quizy more fun or clearer for children?" />}
      {id === "family" && (
        <>
          <h3 className="font-display text-2xl font-semibold text-fg">For families</h3>
          <p>Quizy is a learning game. Play together, talk about the explanation, and take breaks.</p>
          <p>Do not type passwords, addresses, phone numbers, or other private details into feedback. Children should use a family email if an account is created.</p>
          <p>Online battle shows a display name and a score to the other players in that room, not an email address.</p>
        </>
      )}
      {id === "new" && (
        <>
          <h3 className="font-display text-2xl font-semibold text-fg">What's new</h3>
          <p>Accounts save the trail across devices. Online battle rooms use a short code. The owner’s Command Center lives inside the signed-in account. Advanced modes are back. An unfinished question reopens after a refresh.</p>
          <p>Bluetooth battle still belongs to the Quizy Android app, which can host or join a nearby phone. In the browser, use an online room.</p>
        </>
      )}
      {id === "terms" && (
        <>
          <h3 className="font-display text-2xl font-semibold text-fg">Terms and privacy</h3>
          <p>Quizy is an educational game. Questions and explanations are for learning. They are not professional advice.</p>
          <p>An account stores your explorer name, progress, and the questions you were on, so another device can continue. We do not sell that information. Email addresses are hidden from other explorers. The owner can see a masked address in the Command Center.</p>
          <p>Copyright © 2026 Uche Promise Egbe. Quizy and its question banks are proprietary. Do not copy the banks, the name, or the brand mark without permission. Third-party music is not included in this build.</p>
        </>
      )}
    </div>
  );
}

function NoteForm({ kind, title, prompt }: { kind: "problem" | "idea"; title: string; prompt: string }) {
  const { user, pending } = useQuizSession();
  const [body, setBody] = useState("");
  const [note, setNote] = useState("");
  if (pending) return <p>Checking your account…</p>;
  if (!user) {
    return (
      <>
        <h3 className="font-display text-2xl font-semibold text-fg">{title}</h3>
        <p>Sign in to send this to the Quizy owner. Do not include passwords or private contact details.</p>
      </>
    );
  }
  const name =
    (typeof user.user_metadata?.display_name === "string" && user.user_metadata.display_name) ||
    user.email?.split("@")[0] ||
    "Explorer";
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setNote("");
        sendFeedback(kind, body, name, user.id)
          .then(() => {
            setBody("");
            setNote("Sent. Thank you.");
          })
          .catch((error: unknown) => setNote(error instanceof Error ? error.message : "Could not send"));
      }}
    >
      <h3 className="font-display text-2xl font-semibold text-fg">{title}</h3>
      <p>{prompt} Leave out passwords and private details.</p>
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        required
        minLength={8}
        rows={4}
        className="mt-3 w-full rounded-2xl border border-line bg-surface-2 px-4 py-3 text-fg"
      />
      <button type="submit" className="mt-3 min-h-11 rounded-2xl bg-primary px-4 font-extrabold text-primary-fg">
        Send
      </button>
      {note && <p className="mt-2 font-bold text-fg">{note}</p>}
    </form>
  );
}
