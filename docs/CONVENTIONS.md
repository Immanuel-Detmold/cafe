# Conventions

## Query pattern

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

## Mutation pattern

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

`queryClient` is imported directly from `App.tsx` (it's exported there) — don't thread it through props/context.

## Naming & structure

- **Hook naming**: `use[Domain][Action]` — e.g. `useProductsQuery`, `useDeleteProductMutation`
- **File naming**: camelCase for hooks/utils, PascalCase for components
- **DB table names**: PascalCase (`Products`, `Orders`, `OrderItems`, `Inventory`, `Expense`, …)
- **Types**: Derived from generated Supabase types — `Database['public']['Tables']['TableName']['Row' | 'Insert' | 'Update']`; extended via `Omit<...> & { ... }` (e.g. `ProductWithVariations`)
- **Soft deletes**: `update({ deleted: true })` for Products and Inventory — never hard-delete these
- **Audit trail**: Every mutation calls `saveUserAction()` in `onSuccess` (see `data/useUserActions.tsx`)
- **Query keys**: lowercase domain strings — `'products'`, `'ordersAndItems'`, `'inventory'`, `'expenses'`, `'appData'`, etc. Keep new keys consistent with this list (see `DATA_DOMAINS.md`)
- **Constants**: centralized in `src/data/data.tsx` (`PAYMENT_METHODS`, `TitleMap`, `MONTHS`)
- **Language**: UI-facing labels are in German — code/comments/identifiers stay English

## Toasts

```ts
import { useToast } from '@/components/ui/use-toast'

const { toast } = useToast()

// Success
toast({ title: 'Erfolgreichtext...! ✅', duration: 2000 })

// Error
toast({ title: 'Fehlertext... ❌' })
```

Always meaningful German text, success gets a `duration`, errors don't (so they must be dismissed).

## Theming

`ThemeProvider` wraps the app, default `"light"`, persisted to `localStorage` as `"vite-ui-theme"`.
