# Data Domains

All data-fetching hooks live in `packages/frontend/src/data/`, one file per domain, built on TanStack Query v5. See `CONVENTIONS.md` for the query/mutation pattern every hook follows.

| Hook file                    | DB table(s)                 | Purpose                                                                                                                                                                                     |
| ---------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useProducts.ts`             | `Products`, `ProductImages` | Products CRUD, variations, images. Largest product hook.                                                                                                                                    |
| `useProductCategories.tsx`   | `ProductCategories`         | Product category CRUD (colors, sort order).                                                                                                                                                 |
| `useOrders.ts`               | `Orders`, `OrderItems`      | Orders + order items — central to the order flow; largest data hook.                                                                                                                        |
| `useInventory.tsx`           | `Inventory`                 | Inventory items CRUD, soft delete.                                                                                                                                                          |
| `useInventoryCategories.tsx` | `InventoryCategories`       | Inventory category CRUD.                                                                                                                                                                    |
| `useExpense.tsx`             | `Expense`                   | Expense tracking CRUD.                                                                                                                                                                      |
| `useCafeCard.tsx`            | `CafeCards`                 | Stored-value/loyalty cards; linked to `Orders` via `order_id`.                                                                                                                              |
| `useRevenueStreams.tsx`      | `RevenueStreams`, `Orders`  | Revenue stream config + revenue calculations (excludes `cafe_card` payments from revenue totals).                                                                                           |
| `usePrinter.tsx`             | `Printers`                  | Printer configuration CRUD.                                                                                                                                                                 |
| `useUserActions.tsx`         | `UserActions`               | Audit trail — `saveUserAction()` is called from nearly every mutation's `onSuccess`.                                                                                                        |
| `useAppData.tsx`             | `AppData`                   | Generic app-wide data; invalidated by the realtime channel on every DB change. Also exports `getTableNumbers(appData)` — table numbers "1".."N", N from the `table_count` key (default 30). |
| `useUser.ts`                 | — (auth)                    | Current user/session, wraps `services/supabase.ts` `getUser()`.                                                                                                                             |
| `useSumUpPayouts.ts`         | — (SumUp API)               | SumUp payout integration, no direct table queries.                                                                                                                                          |
| `useSumUpWidget.ts`          | — (SumUp API)               | SumUp card widget integration, no direct table queries.                                                                                                                                     |
| `data.tsx`                   | —                           | Shared constants: `PAYMENT_METHODS`, `TitleMap`, `MONTHS`.                                                                                                                                  |
| `printModeStore.ts`          | —                           | Small non-query print-mode state store.                                                                                                                                                     |
| `revenueStreamStore.ts`      | —                           | Small non-query state store for revenue stream UI.                                                                                                                                          |
| `tableNumberStore.ts`        | —                           | Table-number state store (in progress as of 2026-08-24).                                                                                                                                    |

No dedicated hook exists for "Menu" or "Advertisement" — those pages reuse `useProducts`, `useRevenueStreams`, and `useAppData`.

**When adding a new domain**, follow `.agents/skills/cafe-new-feature/SKILL.md` and update this table.
