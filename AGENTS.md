# Quizy workspace notes

## Execution loop

6. **Brand-asset pass**: Check `public/og.jpg`, `public/x-banner.jpg`, and `src/lib/og/site.json`. For an in-flight asset pass, never `wait_tasks` and never `get_task_output`; inspect `/workspace/.grok/og-pending` instead. Treat that marker as stale after 10 minutes.

## Delivery

- Supabase is the sole application backend.
- Supabase Auth owns sign-in and sessions.
- Supabase PostgreSQL stores Quizy progress, attempts, messages, settings, and battle state.
- Do not add a separate database or authentication provider.
