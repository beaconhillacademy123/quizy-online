import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { loadFlags, supabase } from "@/lib/quiz/cloud";

export const Route = createFileRoute("/login")({ component: Login });

const OAUTH = String(import.meta.env.VITE_SUPABASE_OAUTH || "")
  .split(",")
  .map((item) => item.trim())
  .filter((item) => item === "google" || item === "twitter");

type ResetStep = "request" | "verify" | "password";

function Login() {
  const [mode, setMode] = useState<"in" | "up" | "reset">("in");
  const [resetStep, setResetStep] = useState<ResetStep>("request");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);
  const [registrationsOpen, setRegistrationsOpen] = useState(true);

  useEffect(() => {
    loadFlags()
      .then((flags) => setRegistrationsOpen(flags.registrationsEnabled))
      .catch(() => {});
  }, []);

  function changeMode(nextMode: "in" | "up" | "reset") {
    setMode(nextMode);
    setResetStep("request");
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setNote("");
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setNote("");
    setPending(true);
    try {
      if (mode === "reset" && resetStep === "request") {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim());
        if (resetError) throw resetError;
        setResetStep("verify");
        setNote("If that Quizy account exists, a eight-digit code is on its way. Enter it here to continue.");
        return;
      }
      if (mode === "reset" && resetStep === "verify") {
        const code = otp.trim();
        if (!/^\d{6}$/.test(code)) throw new Error("Enter the eight-digit code from your email.");
        const { error: verifyError } = await supabase.auth.verifyOtp({
          email: email.trim(),
          token: code,
          type: "recovery",
        });
        if (verifyError) throw verifyError;
        setResetStep("password");
        setNote("Code verified. Choose a new password for your Quizy account.");
        return;
      }
      if (mode === "reset") {
        if (password.length < 8) throw new Error("Use at least 8 characters for your new password.");
        if (password !== confirmPassword) throw new Error("The passwords do not match.");
        const { error: updateError } = await supabase.auth.updateUser({ password });
        if (updateError) throw updateError;
        await supabase.auth.signOut();
        changeMode("in");
        setNote("Your password has been changed. Sign in with your new password.");
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
    } finally {
      setPending(false);
    }
  }

  const resetRequest = mode === "reset" && resetStep === "request";
  const resetVerify = mode === "reset" && resetStep === "verify";
  const resetPassword = mode === "reset" && resetStep === "password";
  const needsPassword = mode !== "reset" || resetPassword;
  const visiblePassword = showPassword ? "text" : "password";

  return (
    <main className="grid min-h-screen place-items-center bg-bg px-4 py-10 text-fg">
      <div className="screen-in w-full max-w-md rounded-card border border-line bg-surface p-6">
        <p className="text-sm font-extrabold uppercase tracking-widest text-gold">Quizy account</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">
          {resetRequest ? "Reset your password" : resetVerify ? "Enter your code" : resetPassword ? "Choose a new password" : "Save your trail"}
        </h1>
        <p className="mt-2 text-muted">
          {resetRequest || resetVerify || resetPassword
            ? "Recover your existing Quizy account securely with a eight-digit email code."
            : "Sign in with the Quizy Supabase account. Stars, coins, and an unfinished question follow that account. The owner account opens the Command Center."}
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
          {(!resetPassword) && (
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              aria-label="Email"
              autoComplete="username"
              readOnly={resetVerify}
              className="min-h-12 w-full rounded-2xl border border-line bg-surface-2 px-4 font-bold text-fg"
            />
          )}
          {resetVerify && (
            <>
            <input
              required
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{8}"
              value={otp}
              onChange={(event) => {
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 8));
                setError("");
              }}
              placeholder="Eight-digit code"
              aria-label="Eight-digit email code"
              className="min-h-12 w-full rounded-2xl border border-line bg-surface-2 px-4 font-bold tracking-[0.3em] text-fg"
            />
            <p aria-live="polite" className="text-right text-xs font-bold text-muted">
              {otp.length}/8 digits entered
            </p>
            </>
          )}
          {needsPassword && (
            <>
              <div className="relative">
                <input
                  type={visiblePassword}
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={resetPassword ? "New password (8 or more characters)" : "Password (8 or more characters)"}
                  aria-label={resetPassword ? "New password" : "Password"}
                  autoComplete={mode === "up" || resetPassword ? "new-password" : "current-password"}
                  className="min-h-12 w-full rounded-2xl border border-line bg-surface-2 px-4 pr-12 font-bold text-fg"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {resetPassword && (
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Confirm new password"
                    aria-label="Confirm new password"
                    autoComplete="new-password"
                    className="min-h-12 w-full rounded-2xl border border-line bg-surface-2 px-4 pr-12 font-bold text-fg"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              )}
            </>
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
            {pending
              ? "One moment"
              : resetRequest
                ? "Send eight-digit code"
                : resetVerify
                  ? "Verify code"
                  : resetPassword
                    ? "Save new password"
                    : mode === "up"
                      ? "Create account"
                      : "Sign in"}
          </button>
        </form>
        <div className="mt-3 flex flex-wrap gap-3">
          {mode !== "reset" && (
            <button
              type="button"
              className="text-sm font-extrabold text-gold"
              onClick={() => changeMode(mode === "up" ? "in" : "up")}
            >
              {mode === "up" ? "I already have an account" : "New explorer? Create an account"}
            </button>
          )}
          <button type="button" className="text-sm font-extrabold text-muted" onClick={() => changeMode(mode === "reset" ? "in" : "reset")}>
            {mode === "reset" ? "Back to sign in" : "Forgot password"}
          </button>
          {resetVerify && (
            <button type="button" className="text-sm font-extrabold text-muted" onClick={() => { setResetStep("request"); setOtp(""); setNote(""); }}>
              Change email address
            </button>
          )}
          {resetPassword && (
            <button type="button" className="text-sm font-extrabold text-muted" onClick={() => { setResetStep("verify"); setPassword(""); setConfirmPassword(""); setNote(""); }}>
              Back to code
            </button>
          )}
        </div>
        {OAUTH.length > 0 && mode !== "reset" && (
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

