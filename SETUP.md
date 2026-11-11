# Quizy — Supabase setup

Quizy talks only to the existing Supabase project `snxehcpichoskvdtuveh`.
Accounts, progress, questions, messages, feedback, and the Command Center use that project.
Online battles call the Edge Function `quizy-online-battle`. The owner tools call `quizy-command-center`.

Do not set `DATABASE_URL`. Do not add Neon, Better Auth, or PGLite as the game database.
The publishable key may be in the client. A service-role key must never be.

## Already on the live project

These were confirmed against the live API before this migration was written:

- Auth: email and password. Confirmations are currently automatic. Google and X are off.
- Tables: `quizy_questions`, `quizy_profiles`, `quizy_attempts`, `quizy_settings`, `quizy_activity`, `quizy_installations`, `quizy_messages`, `quizy_user_controls`, `parent_feedback`, `quizy_achievements`, `quizy_announcements`, `quizy_battle_rooms`, `quizy_battle_players`, `quizy_battle_answers`.
- There is no `quizy_profiles.resume` column. An unfinished round is stored inside `question_history`.
- `parent_feedback` is `id` and `comment` only.
- Edge Functions `quizy-online-battle` and `quizy-command-center` already answer. Leave the deployed copies in place unless you are restoring a lost project.

`supabase/migrations/20261111000000_quizy_existing.sql` only adds missing tables, columns, and policies. It does not drop or rewrite rows. Run it in the SQL editor only if you are repairing or cloning the project.

## Environment

Set these on Vercel (Production and Preview). Copy names from `.env.example`.

| Name | Where | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Vercel, browser | `https://snxehcpichoskvdtuveh.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Vercel, browser | Publishable or anon key from Supabase → Project Settings → API |
| `VITE_SUPABASE_OAUTH` | Vercel, optional | `google,twitter` only after those providers are enabled |
| `QUIZY_OWNER_EMAIL` | Supabase Edge Function secret | Defaults to `uchep1990@gmail.com` |
| `SUPABASE_SERVICE_ROLE_KEY` | Injected into Edge Functions | Never add this to Vercel |

Do not set `DATABASE_URL` on Vercel. A value there would run the empty platform migrator against a different Postgres.

In Supabase → Authentication → URL configuration, add the Vercel origin and `http://localhost:8080` to the redirect allow list.

## Edge Functions

The copies in `supabase/functions/` reproduce the public contract the app already uses:

- `quizy-online-battle`: `create`, `join`, `state`, `start`, `answer`, `next`, `leave`. Answer keys stay in `quizy_battle_rooms.questions` and are not returned.
- `quizy-command-center`: `whoami`, `summary`, `users`, `settings`, `save_settings`, `send_message`, `user_action`.

They are already deployed. To restore them on this project:

```bash
supabase link --project-ref snxehcpichoskvdtuveh
supabase secrets set QUIZY_OWNER_EMAIL=uchep1990@gmail.com
supabase functions deploy quizy-online-battle --no-verify-jwt
supabase functions deploy quizy-command-center --no-verify-jwt
```

Deploying replaces the live function. Do that only when you intend to restore it. The live battle tables are not readable with the publishable key, so confirm their columns still match `quizy_battle_rooms.questions`, `quizy_battle_players.player_token`, and `quizy_battle_answers (room_id, player_id, round)` before a restore deploy.

The browser does not need a session to play a battle. The Command Center requires the owner email’s Supabase session.

## Vercel

The repository is a Vite TanStack Start app.

1. Import the GitHub repository.
2. Framework preset: leave the default detected from `package.json` / Vite.
3. Set the `VITE_SUPABASE_*` variables above. No service-role key.
4. Do not set `DATABASE_URL`.
5. Deploy. `npm run build` is `vite build` plus a migrator that exits immediately when `DATABASE_URL` is unset.

Auth emails (reset links) use the Supabase mailer. Site URL in the Supabase dashboard should be the Vercel URL.

## What stays on the device

The question bank in `src/data/bank.json` plays with no account. Signing in syncs the trail to `quizy_profiles`. Remote questions whose ids are new are added from `quizy_questions`; local questions win when the id already exists.
