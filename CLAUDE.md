# CLAUDE.md — Cafe Project

## Project Overview

React 18 + TypeScript SPA in a pnpm monorepo. Main package: `packages/frontend/`. Backend: Supabase. Deployed on Netlify.

Skills are in `.agents/skills` folder

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

## State & Data Fetching

- `queryClient` is exported from `App.tsx` and imported directly in hooks for cache invalidation
- Auth state uses `useSyncExternalStore` subscribed to `supabase.auth.onAuthStateChange`
- All data hooks live in `src/data/` — one file per domain

**Query pattern:**

```ts
export const useInventory = () =>
  useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Inventory').select(...)
      if (error) throw error
      return data
    },
  })
```

**Mutation pattern:**

```ts
export const useSaveInventoryMutation = () =>
  useMutation({
    mutationFn: async (item: InsertInventory) => { ... },
    onSuccess: async (data) => {
      await saveUserAction({ action: data, short_description: '...' })
      await queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })
```

## Conventions

- **Hook naming**: `use[Domain][Action]` — e.g. `useProductsQuery`, `useDeleteProductMutation`
- **File naming**: camelCase for hooks/utils, PascalCase for components
- **DB table names**: PascalCase (`Products`, `Orders`, `OrderItems`, `Inventory`, `Expense`)
- **Types**: Derived from generated Supabase types — `Database['public']['Tables']['TableName']['Row|Insert|Update']`; extended with `Omit<...> & { ... }` (e.g. `ProductWithVariations`)
- **Soft deletes**: `update({ deleted: true })` for Products and Inventory
- **Audit trail**: Every mutation calls `saveUserAction()` in `onSuccess`
- **Query keys**: lowercase domain strings — `'products'`, `'ordersAndItems'`, `'inventory'`, `'expenses'`, `'appData'`
- **Constants**: Centralized in `src/data/data.tsx` (`PAYMENT_METHODS`, `TitleMap`, `MONTHS`)
- **Language**: UI labels are in German

## Supabase

- Client: `src/services/supabase.ts`
- Realtime: single channel `'order-db-changes'` on all public schema changes → invalidates `ordersAndItems` + `appData`
- Storage: `ProductImages` bucket for product images
- Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
- Type generation: `pnpm dev:generate:ts`

## Routing Structure

- `/` — redirects to `/admin/new-order` or `/admin/login` based on auth
- `/admin/*` — all admin pages nested under `<Navigation />` layout
- Public routes: `/screen`, `/orders-pdf`, `/menu`, `/advertisement`

## UI / Toasts

Use Toasts with meaningful German text:

```ts
import { useToast } from '@/components/ui/use-toast'

const { toast } = useToast()

// Success
toast({ title: 'Erfolgreichtext...! ✅', duration: 2000 })

// Error
toast({ title: 'Fehlertext... ❌' })
```

- Theme: `ThemeProvider` wraps the app, default `"light"`, persisted to `localStorage` as `"vite-ui-theme"`

## SumUp Integration

Plain text docs: append `index.md` to any SumUp developer URL — e.g. `https://developer.sumup.com/tools/llms/index.md`
