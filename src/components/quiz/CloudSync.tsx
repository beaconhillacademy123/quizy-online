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
      await new Promise<void>((resolve) => {
        if (useQuiz.persist.hasHydrated()) {
          resolve();
          return;
        }
        let unsubscribe = () => {};
        unsubscribe = useQuiz.persist.onFinishHydration(() => {
          unsubscribe();
          resolve();
        });
        if (useQuiz.persist.hasHydrated()) {
          unsubscribe();
          resolve();
        }
      });
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

      const local = useQuiz.getState();
      const row = await pullProfile(user.id, local.name || user.email?.split("@")[0] || "Explorer");
      const localAt = Number(localStorage.getItem("quizy-expedition-saved-at") || 0) || 0;
      const cloudAt = row?.updated_at ? Date.parse(String(row.updated_at)) : 0;
      const localHasProgress =
        local.totalStars > 0 ||
        local.coins > 0 ||
        local.bestStreak > 0 ||
        local.badges.length > 0 ||
        Object.values(local.landDone).some(Boolean) ||
        Object.values(local.landStars).some((value) => value > 0) ||
        Object.keys(local.history).length > 0;
      const cloudBadges = Array.isArray(row?.badges) ? row.badges.map(String) : [];
      const cloudLandStars = (row?.land_stars as Record<string, number> | null) ?? {};
      const cloudLandDone = (row?.land_done as Record<string, boolean> | null) ?? {};
      const cloudHistory = (row?.question_history as Record<string, unknown> | null) ?? {};
      const cloudHasProgress = Boolean(
        row &&
          (Number(row.total_stars ?? 0) > 0 ||
            Number(row.coins ?? 0) > 0 ||
            Number(row.best_streak ?? 0) > 0 ||
            cloudBadges.length > 0 ||
            Object.values(cloudLandDone).some(Boolean) ||
            Object.values(cloudLandStars).some((value) => Number(value) > 0) ||
            Object.keys(cloudHistory).some((key) => !key.startsWith("__"))),
      );

      let cloudApplied = false;
      if (row && cloudHasProgress && !localHasProgress) {
        applyCloudProfile(row);
        cloudApplied = true;
      } else if (row && localHasProgress && !cloudHasProgress) {
        // Keep the device's earned progress if a cloud row was reset or recreated empty.
      } else if (row && localHasProgress && cloudHasProgress) {
        if (localAt > 0 && cloudAt > localAt) {
          applyCloudProfile(row);
          cloudApplied = true;
        } else if (localAt === 0) {
          const history = { ...local.history };
          for (const [key, value] of Object.entries(cloudHistory)) {
            if (key.startsWith("__") || !Array.isArray(value)) continue;
            history[key] = [...new Set([...(history[key] ?? []), ...value.map(String)])];
          }
          const cloudLandCorrect = (row.land_correct as Record<string, number> | null) ?? {};
          const landStars = { ...local.landStars };
          for (const [key, value] of Object.entries(cloudLandStars)) {
            landStars[key] = Math.max(Number(landStars[key] ?? 0), Number(value ?? 0));
          }
          const landCorrect = { ...local.landCorrect };
          for (const [key, value] of Object.entries(cloudLandCorrect)) {
            landCorrect[key] = Math.max(Number(landCorrect[key] ?? 0), Number(value ?? 0));
          }
          const landDone = { ...local.landDone };
          for (const [key, value] of Object.entries(cloudLandDone)) {
            landDone[key] = Boolean(landDone[key] || value);
          }
          useQuiz.setState({
            totalStars: Math.max(local.totalStars, Number(row.total_stars ?? 0)),
            coins: Math.max(local.coins, Number(row.coins ?? 0)),
            bestStreak: Math.max(local.bestStreak, Number(row.best_streak ?? 0)),
            badges: [...new Set([...local.badges, ...cloudBadges])],
            landStars,
            landCorrect,
            landDone,
            history,
          });
        }
      } else if (row && cloudAt > localAt) {
        applyCloudProfile(row);
        cloudApplied = true;
      }

      if (cloudApplied) {
        localStorage.setItem("quizy-expedition-saved-at", String(cloudAt));
      } else {
        await saveProfile(user.id);
        localStorage.setItem("quizy-expedition-saved-at", String(Date.now()));
      }
      await recordInstallation(user.id).catch(() => {});
      await recordActivity(user.id, "app_open", { path: "/" }).catch(() => {});
      ready = true;
    };
    boot().catch(() => setRole(""));
    const unsub = useQuiz.subscribe(() => {
      if (!ready) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        localStorage.setItem("quizy-expedition-saved-at", String(Date.now()));
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
