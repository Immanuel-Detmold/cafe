---
name: cafe-new-feature
description: Checklist for adding a new data domain and/or admin feature page to the Cafe project (packages/frontend), following the repo's existing migration → types → hook → page → route pattern. Use when asked to add a new table/domain, a new admin page, or "a new feature" to this specific project — not a generic React/Supabase guide.
---

# Adding a new domain/feature to the Cafe project

This project (`/Users/ronny/Documents/GitHub/cafe`) repeats the same pattern every time a new data domain or admin feature is added (see git history: revenue streams, cafe cards, table QR codes, etc.). Follow this checklist instead of re-deriving the pattern by reading multiple existing files — it's faster and avoids inconsistencies (wrong query key, forgotten audit trail, etc.).

Read `CLAUDE.md` and `docs/CONVENTIONS.md` first if you haven't this session.

## 1. Migration (if a new table/column is needed)

Add a `.sql` file to `packages/supabase/migrations/`, named `migration_<description>.sql` — **not** the standard timestamped CLI format (see `docs/SUPABASE.md`, this repo's migrations don't use it). Load the `supabase-postgres-best-practices` skill before writing schema/RLS.

## 2. Regenerate types

```
pnpm dev:generate:ts
```

Never hand-edit `packages/frontend/src/services/supabase.types.ts`.

## 3. Data hook

New file `packages/frontend/src/data/use[Domain].tsx` (or `.ts`). Follow the query/mutation pattern in `docs/CONVENTIONS.md` exactly:

- `queryKey`: lowercase domain string, consistent with the existing list in `docs/CONVENTIONS.md`.
- Every mutation's `onSuccess` calls `saveUserAction()` (from `useUserActions.tsx`) then `queryClient.invalidateQueries()`.
- Soft-delete pattern (`update({ deleted: true })`) if the domain needs deletion, matching Products/Inventory.
- Best reference file to copy from: `data/useInventory.tsx` (simple CRUD) or `data/useRevenueStreams.tsx` (if it involves cross-domain calculations).

## 4. Page

New folder `packages/frontend/src/pages/[Domain]/`. For a list-style admin page, use the `columns.tsx` + `data-table.tsx` pair pattern (TanStack Table) — copy the shape from `pages/Inventory/` or `pages/ExpensePage/Expense/`.

## 5. Route

Add the route in `packages/frontend/src/router.tsx`, inside the `admin` children array (auth-gated automatically by the parent loader). Add a Navigation/Sidebar entry in `components/Navigation` if it should be user-reachable, and a Settings sub-page entry under `settings/*` if it's a settings feature (see the existing `settings/*` children for the pattern).

## 6. Update docs (same session, not later)

- Add a row to `docs/DATA_DOMAINS.md` for the new hook.
- Add a row to `docs/ROUTES_PAGES.md` for the new route(s).
- If you hit anything non-obvious, add a line to `docs/LEARNINGS.md`.
