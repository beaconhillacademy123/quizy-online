import { createClient } from "npm:@supabase/supabase-js@2";
import { json, preflight } from "../_shared/http.ts";

const SETTING_KEYS = [
  "maintenance_mode",
  "registrations_enabled",
  "feature_battle",
  "feature_current_affairs",
  "feature_sports",
  "feature_daily_challenge",
  "music_enabled",
  "force_update",
  "min_app_version",
  "announcement",
] as const;

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!name || !domain) return "hidden";
  return `${name.slice(0, 1)}•••@${domain}`;
}

function startOfDay(offset = 0) {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString();
}

Deno.serve(async (req) => {
  const early = preflight(req);
  if (early) return early;
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  const db = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const header = req.headers.get("Authorization") ?? "";
  const jwt = header.toLowerCase().startsWith("bearer ") ? header.slice(7) : "";
  const { data: userData, error: userError } = await db.auth.getUser(jwt);
  if (userError || !userData.user) return json({ error: "Invalid session" }, 403);
  const user = userData.user;
  const ownerEmail = (Deno.env.get("QUIZY_OWNER_EMAIL") || "uchep1990@gmail.com").toLowerCase();
  const isOwner = (user.email || "").toLowerCase() === ownerEmail;

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const action = String(body.action ?? "");
    if (action === "whoami") return json({ admin: isOwner, user_id: user.id });
    if (!isOwner) return json({ error: "Command Center access denied for this account." }, 403);

    if (action === "settings") {
      const { data, error } = await db.from("quizy_settings").select("key,value");
      if (error) throw new Error(error.message);
      const map = new Map((data ?? []).map((row) => [String(row.key), row.value]));
      const settings = {
        maintenance_mode: map.get("maintenance_mode") === true,
        registrations_enabled: map.get("registrations_enabled") !== false,
        feature_battle: map.get("feature_battle") !== false,
        feature_current_affairs: map.get("feature_current_affairs") !== false,
        feature_sports: map.get("feature_sports") !== false,
        feature_daily_challenge: map.get("feature_daily_challenge") !== false,
        music_enabled: map.get("music_enabled") !== false,
        force_update: map.get("force_update") === true,
        min_app_version: typeof map.get("min_app_version") === "string" ? map.get("min_app_version") : "2.2.1",
        announcement: typeof map.get("announcement") === "string" ? map.get("announcement") : null,
      };
      return json({ settings });
    }

    if (action === "save_settings") {
      const incoming = (body.settings ?? {}) as Record<string, unknown>;
      const rows = SETTING_KEYS.map((key) => ({
        key,
        value: incoming[key] ?? null,
        updated_at: new Date().toISOString(),
      }));
      const { error } = await db.from("quizy_settings").upsert(rows, { onConflict: "key" });
      if (error) throw new Error(error.message);
      return json({ ok: true });
    }

    if (action === "users" || action === "summary") {
      const users = [];
      for (let page = 1; page <= 10; page += 1) {
        const listed = await db.auth.admin.listUsers({ page, perPage: 200 });
        if (listed.error) throw new Error(listed.error.message);
        users.push(...listed.data.users);
        if (listed.data.users.length < 200) break;
      }
      const [{ data: profiles }, { data: controls }, { data: activity }, { data: installs }, { data: attempts }] =
        await Promise.all([
          db.from("quizy_profiles").select("user_id,display_name,total_stars,badges,updated_at"),
          db.from("quizy_user_controls").select("user_id,suspended,reason,updated_at"),
          db.from("quizy_activity").select("user_id,event_type,created_at").gte("created_at", startOfDay(-13)),
          db.from("quizy_installations").select("user_id,install_key,last_seen_at"),
          db.from("quizy_attempts").select("user_id,total_questions,played_at").gte("played_at", startOfDay(-13)),
        ]);
      const profileByUser = new Map<string, { display_name: string; total_stars: number; badges: number; updated_at: string }>();
      for (const row of profiles ?? []) {
        const current = profileByUser.get(String(row.user_id));
        const stars = Number(row.total_stars ?? 0);
        if (current && current.total_stars >= stars) continue;
        profileByUser.set(String(row.user_id), {
          display_name: String(row.display_name || "Explorer"),
          total_stars: stars,
          badges: Array.isArray(row.badges) ? row.badges.length : 0,
          updated_at: String(row.updated_at || ""),
        });
      }
      const controlByUser = new Map((controls ?? []).map((row) => [String(row.user_id), row]));
      const lastActive = new Map<string, string>();
      for (const row of activity ?? []) {
        const id = String(row.user_id);
        const at = String(row.created_at);
        if (!lastActive.get(id) || at > (lastActive.get(id) ?? "")) lastActive.set(id, at);
      }
      for (const row of installs ?? []) {
        const id = String(row.user_id);
        const at = String(row.last_seen_at || "");
        if (at && (!lastActive.get(id) || at > (lastActive.get(id) ?? ""))) lastActive.set(id, at);
      }
      const roster = users.map((account) => {
        const profile = profileByUser.get(account.id);
        const control = controlByUser.get(account.id);
        return {
          user_id: account.id,
          display_name: profile?.display_name || String(account.user_metadata?.display_name || account.email?.split("@")[0] || "Explorer"),
          email_masked: maskEmail(account.email || ""),
          suspended: control?.suspended === true,
          last_active: lastActive.get(account.id) || profile?.updated_at || account.last_sign_in_at || null,
          badges: profile?.badges ?? 0,
          total_stars: profile?.total_stars ?? 0,
        };
      });
      if (action === "users") return json({ users: roster });

      const today = startOfDay(0);
      const activeToday = new Set((activity ?? []).filter((row) => String(row.created_at) >= today).map((row) => String(row.user_id)));
      const playedToday = new Set((attempts ?? []).filter((row) => String(row.played_at) >= today).map((row) => String(row.user_id)));
      const questionsToday = (attempts ?? [])
        .filter((row) => String(row.played_at) >= today)
        .reduce((sum, row) => sum + Number(row.total_questions ?? 0), 0);
      const badges = roster.reduce((sum, row) => sum + row.badges, 0);
      const daily = [];
      for (let offset = -13; offset <= 0; offset += 1) {
        const from = startOfDay(offset);
        const to = startOfDay(offset + 1);
        const count = new Set(
          (activity ?? [])
            .filter((row) => String(row.created_at) >= from && String(row.created_at) < to)
            .map((row) => String(row.user_id)),
        ).size;
        daily.push({ label: from.slice(5, 10), count });
      }
      return json({
        registered_users: users.length,
        detected_installations: (installs ?? []).length,
        daily_active: activeToday.size,
        daily_players: playedToday.size,
        questions_answered: questionsToday,
        badges_earned: badges,
        daily,
      });
    }

    if (action === "send_message") {
      const ids = Array.isArray(body.user_ids) ? body.user_ids.map(String) : [];
      const subject = String(body.subject ?? "").trim();
      const message = String(body.message ?? "").trim();
      if (!ids.length || !subject || !message) return json({ error: "Choose explorers and write the message." }, 400);
      const rows = ids.map((id) => ({
        recipient_user_id: id,
        subject,
        message,
        sender_name: String(body.sender_name ?? "Quizy Expedition Commander"),
      }));
      const { error } = await db.from("quizy_messages").insert(rows);
      if (error) throw new Error(error.message);
      const emailStatus = body.email_requested
        ? "Delivered inside Quizy. Email is not sent from this function."
        : "";
      return json({ sent_count: ids.length, email_status: emailStatus });
    }

    if (action === "user_action") {
      const userId = String(body.user_id ?? "");
      const next = String(body.action ?? "");
      if (!userId || (next !== "suspend" && next !== "restore")) return json({ error: "Unknown explorer action." }, 400);
      const { error } = await db.from("quizy_user_controls").upsert(
        {
          user_id: userId,
          suspended: next === "suspend",
          reason: String(body.reason ?? "Command Center action"),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );
      if (error) throw new Error(error.message);
      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Command failed" }, 400);
  }
});
