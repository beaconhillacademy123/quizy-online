# Quizy visual and account-flow update

This update is based on the existing Supabase-backed Quizy project. It does not replace the database, authentication provider, user records, game progress, coins, subscriptions, admin roles, or deployed Edge Functions.

## Included
- Adventure-world visual refresh and responsive scenic layout.
- All 12 land illustrations plus compass, horizon, and table artwork under `public/art/`.
- Matching illustrated land tiles, scenic camp/map banner, and short tap-to-enter splash gate.
- Login screen with show/hide password controls.
- Password recovery UI: email request, eight-digit recovery code verification, new password, and confirmation.
- Battle-room deep-link joining (`?room=CODE`), copy room code, copy invite URL, and native share sheet.

## Supabase Auth recovery configuration required
The recovery UI uses Supabase `resetPasswordForEmail`, `verifyOtp({ type: "recovery" })`, and `updateUser({ password })`. Configure the Supabase Auth recovery email template to display the OTP token (`{{ .Token }}`), not only an action URL, and set the project's email OTP length to **8** in Auth settings. Keep the Quizy production URL in the allowed redirect/site URL list. Without the matching template and OTP-length setting, the eight-digit code flow cannot complete successfully.

## Validation
The repository's 100 existing Node tests pass. A production build and TypeScript check have not been run in this environment because project dependencies are not installed here.
