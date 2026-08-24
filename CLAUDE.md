# CLAUDE.md — Cafe Project

**Agent-only project** — no human reads this code directly. Keep docs accurate and up to date; that's how the next session works fast instead of re-deriving everything by grepping the whole repo.

## Project Overview

React 18 + TypeScript SPA in a pnpm monorepo. Main package: `packages/frontend/`. Backend: Supabase. Production: Coolify (`immanuel-cafe.de`); Netlify serves dev previews only — see `docs/DEPLOYMENT.md`.

## Tech Stack

- **Framework**: React 18 + TypeScript, Vite (base path `/cafe`, port 3000)
- **Routing**: React Router DOM v6 (`createBrowserRouter`, nested layout)
- **Server State**: TanStack Query v5 — no Redux/Zustand
- **Backend/DB**: Supabase JS v2 (typed with generated `supabase.types.ts`)
- **UI**: shadcn/ui + Radix UI primitives (components in `src/components/ui/`, owned source files)
- **Styling**: Tailwind CSS + daisyUI + `tailwindcss-animate`, dark mode via `class`, CSS HSL variables
- **Forms**: react-hook-form
- **Charts**: recharts
- **Icons**: lucide-react + @heroicons/react
- **Dates**: date-fns v3
- **Testing**: Vitest

## Path Alias

`@/` → `packages/frontend/src/`

## Commands

- `pnpm dev` — generates Supabase TS types, then starts Vite
- `pnpm build` — `tsc && vite build`
- `pnpm test` — Vitest
- `pnpm dev:generate:ts` — regenerate Supabase types manually

## Docs — read before searching the repo

Detailed reference lives in `docs/`, kept out of this file to save tokens. Read the relevant file **before** grepping around — it's almost always faster:

| File                   | Read it when...                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------- |
| `docs/ARCHITECTURE.md` | You need the `src/` folder map, or you're about to touch a large/high-blast-radius file (list included) |
| `docs/DATA_DOMAINS.md` | You need to find or add a `data/` hook, or map a domain to its DB table                                 |
| `docs/ROUTES_PAGES.md` | You need to find a page/route, or add a new one                                                         |
| `docs/SUPABASE.md`     | You're touching migrations, edge functions, or type generation                                          |
| `docs/CONVENTIONS.md`  | You're writing a hook, mutation, toast, or need the naming rules                                        |
| `docs/DEPLOYMENT.md`   | You're touching build/deploy config or env vars                                                         |
| `docs/LEARNINGS.md`    | Self-updating log of gotchas — check it, and add to it (see below)                                      |

**Supabase gotchas (learned 2026-08-24, full detail in `docs/SUPABASE.md`):**

- Files in `packages/supabase/migrations/` are **never auto-applied** — no CI/deploy hook runs them. A migration you write does nothing until someone actually executes it (`supabase db push`, needs a DB password not stored in the repo; or the Management API with `SUPABASE_ACCESS_TOKEN` from `packages/frontend/.env.local` as a fallback). This is a write action against the production DB — confirm with Ronny before running it.
- The globally logged-in `supabase` CLI account is **not** this project's account (`supabase projects list` won't show `hmwxeqgcfhhumndveboe`) — only `SUPABASE_ACCESS_TOKEN` in `.env.local` is scoped to it.
- `AppData` RLS is `authenticated`-only by default. A public page (e.g. `/menu`) reading it via the anon key silently gets `[]` — no error, just looks broken for real customers. A new public-facing AppData read needs its own narrowly-scoped `anon` SELECT policy (never a blanket one — the table also holds `server_ip`/`server_port`, which must stay private).

For SumUp integration details, use the `sumup` skill. For adding a new data domain + page end-to-end, use the `cafe-new-feature` skill (`.agents/skills/cafe-new-feature/SKILL.md`) — it's a checklist, follow it instead of re-deriving the pattern from scratch.

## Self-Improvement (do this every session)

This is not optional busywork — stale docs cost the _next_ session real tokens and cause mistakes. Before you finish a task:

1. If you learned something reusable (a gotcha, a quirk, a location you had to search for) that isn't in `docs/`, add a dated line to `docs/LEARNINGS.md`, or fold it directly into the relevant doc if it clearly belongs there.
2. If you added/changed a data domain, route, or page, update `docs/DATA_DOMAINS.md` / `docs/ROUTES_PAGES.md` in the same session — don't leave it for later.
3. If a doc turns out to be wrong, fix it immediately rather than working around the inaccuracy silently.

## Other agent-instruction files

`AGENTS.md`, `.cursorrules`, and `.github/copilot-instructions.md` are thin pointers to this file (for Codex/Cursor/Copilot). They carry no independent facts — don't edit them when updating docs, and don't let them drift; if you ever need to change something in them, change it here first.

Skills live in `.agents/skills/<name>/SKILL.md` (mirrored to `.claude/skills/`).

## State & Data Fetching

- `queryClient` is exported from `App.tsx` and imported directly in hooks for cache invalidation
- Auth state uses `useSyncExternalStore` subscribed to `supabase.auth.onAuthStateChange`
- All data hooks live in `src/data/` — one file per domain (see `docs/DATA_DOMAINS.md`)
- Query/mutation code pattern: `docs/CONVENTIONS.md`

## UI / Toasts

```ts
import { useToast } from '@/components/ui/use-toast'

const { toast } = useToast()
toast({ title: 'Erfolgreichtext...! ✅', duration: 2000 }) // success
toast({ title: 'Fehlertext... ❌' }) // error
```

Full conventions (naming, soft deletes, audit trail, query keys): `docs/CONVENTIONS.md`.
