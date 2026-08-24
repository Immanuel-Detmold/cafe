# Supabase

## Project layout

`packages/supabase/` is the Supabase CLI project root — it has **no `package.json`**, it's a pnpm-workspace member only in the glob sense.

```
packages/supabase/
  config.toml       CLI project config
  import_map.json   Deno import map
  functions/         Edge Functions (Deno) — all SumUp-related, see below
  migrations/         loose *.sql files (NOT the standard supabase-cli timestamped format)
```

**Migrations quirk**: files are named `migration_<description>.sql`, not the standard CLI `<timestamp>_<name>.sql` format. Follow the existing naming style when adding a new one — don't switch to timestamped names, it'll look inconsistent with the rest.

Current migrations (chronological by content, not filename order): `migration_add_category_color.sql`, `migration_add_is_cafe_card_to_products.sql`, `migration_add_order_id_to_cafe_cards.sql`, `migration_add_show_on_menu_to_products.sql`, `migration_order_number.sql`, `migration_rename_voucher_to_free_drink.sql`, `migration_sort_order.sql`, `migration_add_table_number_selectable_appdata.sql`, `migration_allow_anon_read_table_number_selectable.sql`, `migration_add_table_count_appdata.sql`, `migration_allow_anon_read_table_count.sql`.

## Edge Functions (`packages/supabase/functions/`)

All four are SumUp payment integration endpoints:

- `sumup-create-online-checkout`
- `sumup-fetch-terminal-fee`
- `sumup-terminal-checkout`
- `sumup-verify-create-order`

See the `sumup` skill for SumUp API details.

## Client & realtime

- Client: `packages/frontend/src/services/supabase.ts`
- Realtime: single channel `'order-db-changes'`, subscribed to all public schema changes → invalidates the `ordersAndItems` and `appData` query keys.
- Storage: `ProductImages` bucket for product images.

## Env vars

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## Type generation

`pnpm dev:generate:ts` regenerates `packages/frontend/src/services/supabase.types.ts` from the **live** Supabase project (`supabase gen types typescript --project-id hmwxeqgcfhhumndveboe`, using `.env.local`). This also runs automatically as the first step of `pnpm dev`. Never hand-edit the generated file — change the DB schema (migration) and regenerate instead.

## Applying migrations

**Files in `migrations/` are NOT automatically applied anywhere** — there's no CI/deploy hook that runs them. A `.sql` file in this folder is just history/documentation until someone actually executes it against the live DB. Confirmed 2026-08-24: a migration sat in the repo unapplied and silently did nothing until run manually.

- **Preferred**: `cd packages/supabase && supabase link --project-ref hmwxeqgcfhhumndveboe && supabase db push`. Needs the DB (Postgres) password, which is **not** stored anywhere in the repo/env files — get it from the Supabase dashboard or ask Ronny.
- **The globally logged-in `supabase` CLI session is a different Supabase account.** `supabase projects list` shows _that_ account's projects, which does **not** include `hmwxeqgcfhhumndveboe` — don't assume `supabase link` will find it. Only `SUPABASE_ACCESS_TOKEN` in `packages/frontend/.env.local` is scoped to this project.
- **Workaround when the DB password isn't available**: the Supabase Management API accepts raw SQL using that access token (not the DB password):
  ```bash
  set -a; source packages/frontend/.env.local; set +a
  curl -s -X POST "https://api.supabase.com/v1/projects/hmwxeqgcfhhumndveboe/database/query" \
    -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" -H "Content-Type: application/json" \
    -d '{"query": "<sql here>"}'
  ```
  Write migrations **idempotently** (`INSERT ... WHERE NOT EXISTS (...)`, `DROP POLICY IF EXISTS` before `CREATE POLICY`, etc.) so re-running one this way is always safe.
- This is a risky/write action against the production DB — treat it accordingly (confirm with Ronny before running, same as any other destructive/hard-to-reverse action).

## Row Level Security

`AppData` has RLS enabled with exactly **one** policy: `ALL` access for the `authenticated` role only (confirmed via `pg_policies`). Consequences:

- Admin pages (behind login) read/write `AppData` fine through `useAppData()` / `useUpdateAppData()`.
- Any **public, unauthenticated** page (e.g. `/menu`, the customer-facing menu card) reading `AppData` through the anon/publishable key gets an **empty result, silently** — `[]`, no error. Very easy to miss; a feature can look wired up correctly in the frontend and still never work for real customers.
- `AppData` also holds values that must stay private (`server_ip`, `server_port` — the local print server's address), so **never add a blanket anon-read policy** on the whole table. Instead add a policy scoped to exactly the key(s) that need public exposure:
  ```sql
  CREATE POLICY "Allow anon read of <key>" ON "AppData" FOR SELECT TO anon USING (key = '<key>');
  ```
  Real example: `migration_allow_anon_read_table_number_selectable.sql`.
- Current `AppData` keys (as of 2026-08-24): `advertisement_timer`, `feedback_code`, `menu_link`, `order_number`, `organisation_logo`, `organisation_name`, `print_mode`, `server_ip`, `server_port`, `table_count`, `table_number_selectable`, `voice`. Only the first few (org/menu display info), `table_number_selectable`, and `table_count` are public-safe; the rest should stay authenticated-only.
