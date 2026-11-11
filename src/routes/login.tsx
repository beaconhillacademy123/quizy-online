import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { loadFlags, supabase } from "@/lib/quiz/cloud";

export const Route = createFileRoute("/login")({ component: Login });

const OAUTH = String(import.meta.env.VITE_SUPABASE_OAUTH || "")
  .split(",")
  .map((item) => item.trim())
  .filter((item) => item === "google" || item === "twitter");

function Login() {
  const [mode, setMode] = useState<"in" | "up" | "reset">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);
  const [registrationsOpen, setRegistrationsOpen] = useState(true);

  useEffect(() => {
    loadFlags()
      .then((flags) => setRegistrationsOpen(flags.registrationsEnabled))
      .catch(() => {});
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setNote("");
    setPending(true);
    try {
      if (mode === "reset") {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/login`,
        });
        if (resetError) throw resetError;
        setNote("If that account exists, a reset link is on its way.");
        setPending(false);
        return;
      }
      if (mode === "up") {
        if (!registrationsOpen) throw new Error("New accounts are paused.");
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { display_name: name.trim() || "Explorer" }, emailRedirectTo: `${window.location.origin}/` },
        });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setNote("Account created. Confirm the email, then sign in.");
          setMode("in");
          setPending(false);
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
      }
      window.location.href = "/";
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Sign-in failed");
      setPending(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-bg px-4 py-10 text-fg">
      <div className="screen-in w-full max-w-md rounded-card border border-line bg-surface p-6">
        <p className="text-sm font-extrabold uppercase tracking-widest text-gold">Quizy account</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Save your trail</h1>
        <p className="mt-2 text-muted">
          Sign in with the Quizy Supabase account. Stars, coins, and an unfinished question follow that account. The
          owner account opens the Command Center.
        </p>
        <form className="mt-5 space-y-3" onSubmit={submit}>
          {mode === "up" && (
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Explorer name"
              aria-label="Explorer name"
              className="min-h-12 w-full rounded-2xl border border-line bg-surface-2 px-4 font-bold text-fg"
            />
          )}
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            aria-label="Email"
            autoComplete="username"
            className="min-h-12 w-full rounded-2xl border border-line bg-surface-2 px-4 font-bold text-fg"
          />
          {mode !== "reset" && (
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password (8 or more characters)"
              aria-label="Password"
              autoComplete={mode === "up" ? "new-password" : "current-password"}
              className="min-h-12 w-full rounded-2xl border border-line bg-surface-2 px-4 font-bold text-fg"
            />
          )}
          {error && <p className="text-sm font-bold text-bad">{error}</p>}
          {note && <p className="text-sm font-bold text-muted">{note}</p>}
          {!registrationsOpen && mode === "up" && (
            <p className="text-sm text-muted">New accounts are paused. Sign in if you already have one.</p>
          )}
          <button
            type="submit"
            disabled={pending || (mode === "up" && !registrationsOpen)}
            className="min-h-12 w-full rounded-2xl bg-primary font-extrabold text-primary-fg disabled:opacity-50"
          >
            {pending ? "One moment" : mode === "up" ? "Create account" : mode === "reset" ? "Send reset link" : "Sign in"}
          </button>
        </form>
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            className="text-sm font-extrabold text-gold"
            onClick={() => setMode(mode === "up" ? "in" : "up")}
          >
            {mode === "up" ? "I already have an account" : "New explorer? Create an account"}
          </button>
          <button type="button" className="text-sm font-extrabold text-muted" onClick={() => setMode(mode === "reset" ? "in" : "reset")}>
            {mode === "reset" ? "Back to sign in" : "Forgot password"}
          </button>
        </div>
        {OAUTH.length > 0 && (
          <div className="mt-5 grid gap-2">
            {OAUTH.map((provider) => (
              <button
                key={provider}
                type="button"
                onClick={() => {
                  void supabase.auth.signInWithOAuth({
                    provider,
                    options: { redirectTo: `${window.location.origin}/` },
                  });
                }}
                className="min-h-12 rounded-2xl border border-line font-extrabold"
              >
                Continue with {provider === "twitter" ? "X" : "Google"}
              </button>
            ))}
          </div>
        )}
        <Link to="/" className="mt-5 block text-center text-sm font-extrabold text-muted">
          Back to camp
        </Link>
      </div>
    </main>
  );
}
