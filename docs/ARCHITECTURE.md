# Architecture

Monorepo (pnpm workspace, `packages/*`): `packages/frontend` (React SPA) + `packages/supabase` (CLI project root: migrations + edge functions, no `package.json`).

## `packages/frontend/src/` layout

| Path                      | Contents                                                                                                                                                                                       |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `App.tsx`                 | Root component; exports `queryClient` (TanStack Query) — imported directly by hooks in `data/` for cache invalidation                                                                          |
| `main.tsx`                | Vite entry point                                                                                                                                                                               |
| `router.tsx`              | Single `createBrowserRouter` definition for the entire app — see `ROUTES_PAGES.md`                                                                                                             |
| `components/`             | Shared cross-page components (Navigation, Header, ProductCard, AudioTemplates, ThemeProvider); `components/ui/` = shadcn/ui + Radix primitives, owned source (edit directly, not a dependency) |
| `data/`                   | Data-fetching hooks, one file per domain — see `DATA_DOMAINS.md`                                                                                                                               |
| `generalHelperFunctions/` | Pure, non-React helpers (date, currency, color, consumption/statistics calculations)                                                                                                           |
| `lib/`                    | `customTypes.ts` (shared TS types), `utils.ts` (`cn()` class-merge helper etc.)                                                                                                                |
| `pages/`                  | Route-level page components, one folder per feature — see `ROUTES_PAGES.md`                                                                                                                    |
| `services/`               | `supabase.ts` (client + `getUser()`), `supabase.types.ts` (generated DB types — **never hand-edit**, regenerate via `pnpm dev:generate:ts`)                                                    |

No separate `routes/` or `hooks/` folder — hooks live in `data/`, routing is centralized in `router.tsx`.

## Large / high-blast-radius files

Read carefully before editing; changes here have wide reach.

| File                                                          | ~Lines | Note                                                                                                                                                                              |
| ------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pages/NewOrder/NewOrder.tsx`                                 | 1200+  | Largest file in the repo. Core order-taking screen — touches products, inventory, categories, printing, cafe cards.                                                               |
| `pages/AllProducts/CreateProduct/CreateProductV2.tsx`         | 700+   | Product editor: variations, consumption, image upload. The old `CreateProduct (old).tsx` / `EditProduct (old).tsx` were removed 2026-08-24 — this is the only product editor now. |
| `services/supabase.types.ts`                                  | 700+   | Auto-generated. Regenerate via `pnpm dev:generate:ts`, never hand-edit.                                                                                                           |
| `pages/Statistic/StatisticPage.tsx`                           | 600+   | Main statistics/dashboard page.                                                                                                                                                   |
| `data/useOrders.ts`                                           | 400+   | Largest data hook — Orders + OrderItems, central to order flow and the realtime channel.                                                                                          |
| `pages/Open/Open.tsx`                                         | 400+   | Shared between `/admin/open` variants via `statusList`/`paymentPage` props.                                                                                                       |
| `pages/Settings/RevenueStreamManagement/StreamManagement.tsx` | 400+   | Revenue stream config UI.                                                                                                                                                         |

## Recurring UI pattern

List-heavy admin pages (Inventory, Expense, PrinterPage, UserActions) use a `columns.tsx` + `data-table.tsx` pair built on TanStack Table. Follow this pattern for new list pages.

## Tooling

- Linting: ESLint (`--max-warnings 0`, strict) + `@tanstack/eslint-plugin-query`.
- Formatting: Prettier + import-sort + tailwindcss plugins; Husky + lint-staged run Prettier on staged files at commit time.
- Root `package.json` scripts (`build`, `dev`, `lint`, `test`, etc.) fan out to all workspace packages via `pnpm run -r <script>`.

## Known cleanup done (2026-08-24)

A stray top-level `supabase/` directory (duplicate/leftover of `packages/supabase/`, only `cli-latest` tracked in git) and the dead `CreateProduct (old).tsx` / `EditProduct (old).tsx` files were removed. If you see references to either reappear, they're stale — the canonical Supabase project root is `packages/supabase/`, and the canonical product editor is `CreateProductV2.tsx`.
