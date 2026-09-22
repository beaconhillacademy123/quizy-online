# Quizy Online — Phase 1

Independent Quizy PWA foundation. No Beacon Hill / school functionality is included.

## Included
- Installable PWA shell
- Existing Quizy 2.2.1 game retained
- Supabase cloud question bank foundation
- Supabase account/profile foundation
- Cloud progress/attempt foundation
- RLS policies for Quizy tables
- Offline-capable shell with online sync architecture

## Intellectual property

Quizy is proprietary unless a component is expressly identified as third-party material.

- [PROPRIETARY_LICENSE.md](./PROPRIETARY_LICENSE.md) — ownership and permission terms
- [TERMS_OF_USE.md](./TERMS_OF_USE.md) — product-use restrictions
- [IP_RECORD.md](./IP_RECORD.md) — creation/evidence preservation record
- [THIRD_PARTY_ASSETS.md](./THIRD_PARTY_ASSETS.md) — third-party asset and licence register

Do not assume that a copyright notice alone replaces copyright registration, trademark registration, licensing records, or other evidence of ownership.

## Setup
1. Run `quizy_schema.sql` in the Quizy Supabase project.
2. Deploy this folder to HTTPS hosting (Vercel is suitable).
3. Open the URL on Android/Chrome and install Quizy to the home screen.
4. The next phase adds the polished Quizy account UI and admin content dashboard.

Do not put a Supabase service-role key in the browser. The browser should use only the publishable/anon key with RLS enabled.

<!-- Production redeploy trigger: restore known-good Quizy build. -->