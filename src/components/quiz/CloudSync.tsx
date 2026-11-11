import { useEffect } from "react";
import { setRemoteQuestions } from "@/lib/quiz/logic";
import {
  acknowledgeMessage,
  applyCloudProfile,
  listMessages,
  loadFlags,
  loadRemoteQuestions,
  logLandAttempt,
  ownControl,
  pullProfile,
  recordActivity,
  recordInstallation,
  saveProfile,
  signOut,
  supabase,
  useQuizSession,
  type PublicFlags,
} from "@/lib/quiz/cloud";
import { useQuiz } from "@/lib/quiz/store";

export function CloudSync({ onFlags }: { onFlags: (flags: PublicFlags) => void }) {
  const { user, pending } = useQuizSession();
  const setRole = useQuiz((s) => s.setRole);
  const landDone = useQuiz((s) => s.landDone);

  useEffect(() => {
    loadFlags()
      .then(onFlags)
      .catch(() => {});
    loadRemoteQuestions()
      .then((rows) => setRemoteQuestions(rows))
      .catch(() => {});
  }, [onFlags]);

  useEffect(() => {
    if (!import.meta.env.PROD) return;
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  useEffect(() => {
    if (pending) return;
    if (!user) {
      setRole("");
      return;
    }
    let ready = false;
    let timer = 0;
    const boot = async () => {
      const control = await ownControl(user.id).catch(() => null);
      if (control?.suspended) {
        await signOut();
        setRole("");
        return;
      }
      const who = await supabase.functions
        .invoke("quizy-command-center", { body: { action: "whoami" } })
        .then((result) => result.data as { admin?: boolean } | null)
        .catch(() => null);
      setRole(who?.admin ? "owner" : "explorer");
      const row = await pullProfile(user.id, useQuiz.getState().name || user.email?.split("@")[0] || "Explorer");
      let localAt = 0;
      try {
        localAt = JSON.parse(localStorage.getItem("quizy-expedition") || "{}").state?.savedAt ?? 0;
      } catch {
        localAt = 0;
      }
      const cloudAt = row?.updated_at ? Date.parse(String(row.updated_at)) : 0;
      if (row && cloudAt > localAt) applyCloudProfile(row);
      else await saveProfile(user.id);
      await recordInstallation(user.id).catch(() => {});
      await recordActivity(user.id, "app_open", { path: "/" }).catch(() => {});
      ready = true;
    };
    boot().catch(() => setRole(""));
    const unsub = useQuiz.subscribe(() => {
      if (!ready) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        saveProfile(user.id).catch(() => {});
      }, 900);
    });
    return () => {
      ready = false;
      unsub();
      window.clearTimeout(timer);
    };
  }, [pending, setRole, user?.id]);

  useEffect(() => {
    if (!user) return;
    const seen = new Set(Object.entries(landDone).filter(([, done]) => done).map(([id]) => id));
    return useQuiz.subscribe((state, prev) => {
      for (const [id, done] of Object.entries(state.landDone)) {
        if (!done || prev.landDone[id] || seen.has(id)) continue;
        seen.add(id);
        const correct = state.round?.landId === id ? state.round.correct : (state.landCorrect[id] ?? 0);
        logLandAttempt(user.id, id, correct, 10).catch(() => {});
        recordActivity(user.id, "expedition_complete", { landId: id }).catch(() => {});
      }
    });
  }, [user?.id, landDone]);

  return null;
}

export { listMessages, acknowledgeMessage };
