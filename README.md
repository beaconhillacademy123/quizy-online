# Quizy

Educational quiz for children. Copyright © 2026 Uche Promise Egbe.

Accounts, saved progress, messages, and online battles use the existing Supabase project. Setup, environment variables, and the safe migration are in [SETUP.md](./SETUP.md).

## Play

- Camp: name, age (5–7 or 8–10), and difficulty, including Advanced modes (Beast, Mastermind, Quiz Master, Dragon, Ultimate, Legend, Elite, Volcano).
- Trail: twelve lands, daily challenge, Year 1 academy, badges, and a device board that records a name when every land is finished. Current affairs and the sports arena follow the Command Center switches.
- An unfinished question is kept if you leave or refresh, including inside the signed-in profile.
- Sign in with email to save the trail across devices. Password reset is on the same screen. Google or X appear only when `VITE_SUPABASE_OAUTH` lists a provider that is enabled in Supabase Auth.
- Online battle uses a room code and the `quizy-online-battle` function. The answer key stays on the server. Bluetooth battle works only inside the Android app in `android/`, which calls `window.QuizyBluetooth`.
- The Command Center opens for the owner account (`uchep1990@gmail.com` unless `QUIZY_OWNER_EMAIL` says otherwise).

## Publish

Deploy this repository to the existing Vercel project. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Do not set `DATABASE_URL` and do not put a service-role key in the frontend. The Android `QUIZY_URL` in `MainActivity.java` still points at the previous hosted site; change it after this app has a public address.

Questions, the Quizy name, and the brand mark are proprietary. This build does not include third-party music.
