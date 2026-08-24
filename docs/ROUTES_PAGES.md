# Routes & Pages

All routing is defined in one file: `packages/frontend/src/router.tsx` (`createBrowserRouter`, no lazy loading). Page components live in `packages/frontend/src/pages/`, one folder per feature.

## Public routes (no auth)

| Path                                                                         | Component                                                                  |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `/`                                                                          | Redirects to `/admin/new-order` (logged in) or `/admin/login` (logged out) |
| `/screen`                                                                    | `pages/ReadyForPickup/ReadyForPickup.tsx` — pickup display screen          |
| `/orders-pdf`                                                                | `pages/Statistic/GeneratePDF/OrdersPDF.tsx` — react-pdf report             |
| `/menu`, `/menu/orders`, `/menu/impressum`, `/menu/datenschutz`, `/menu/agb` | `pages/MenuCard/` — customer-facing menu, order tracking, legal pages      |
| `/advertisement`                                                             | `pages/AdvertismentPage.tsx`                                               |

## `/admin/*` (auth-gated via router loader, wrapped in `<Navigation />` layout)

Public sub-paths inside `/admin` (no auth required despite the prefix): `login`, `forgot-pw`, `update-pw`.

| Feature area               | Paths                                                                                         | Component(s)                                                                               |
| -------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Orders                     | `new-order`, `new-order/edit/:orderId`                                                        | `pages/NewOrder/NewOrder.tsx`                                                              |
| Open orders                | `open`                                                                                        | `pages/Open/Open.tsx` (props `statusList`, `paymentPage`)                                  |
| Ready for pickup           | `ready-for-pickup`                                                                            | `pages/ReadyForPickup/ReadyForPickup.tsx`                                                  |
| Closed orders              | `closed-orders`                                                                               | `pages/ClosedOrdersToday.tsx`                                                              |
| Products                   | `all-products`, `all-products/:productId`, `create-product`                                   | `pages/AllProducts/AllProducts.tsx`, `pages/AllProducts/CreateProduct/CreateProductV2.tsx` |
| Inventory                  | `inventory`, `inventory/:id`, `inventory/new-item`                                            | `pages/Inventory/Inventory/Inventory.tsx`, `pages/Inventory/NewItem.tsx`                   |
| Expenses                   | `expense`, `new-expense`, `new-expense/:expenseId`                                            | `pages/ExpensePage/Expense/ExpenseTable.tsx`, `pages/ExpensePage/NewExpense.tsx`           |
| Cafe Cards                 | `cafe-cards`                                                                                  | `pages/CafeCards/CafeCardsPage.tsx`                                                        |
| Statistics                 | `statistic`                                                                                   | `pages/Statistic/StatisticPage.tsx`                                                        |
| Audio                      | `audio`                                                                                       | `pages/AudioPage/AudioPage.tsx`                                                            |
| Auth                       | `login`, `forgot-pw`, `update-pw`                                                             | `pages/Authentication/`                                                                    |
| Settings hub               | `settings`                                                                                    | `pages/Settings/SettingsPage.tsx`                                                          |
| — manage users             | `settings/manage-users`, `settings/manage-users/:userId`                                      | `pages/Settings/ManageUsers/`                                                              |
| — organisation             | `settings/organisation`                                                                       | `pages/Settings/Organisation.tsx`                                                          |
| — user actions (audit log) | `settings/user-actions`                                                                       | `pages/Settings/UserActions/UserActions.tsx`                                               |
| — network                  | `settings/network`                                                                            | `pages/Settings/NetworkPage/NetworkPage.tsx`                                               |
| — printers                 | `settings/printer`, `settings/printer/new-printer`, `settings/printer/new-printer/:printerId` | `pages/Settings/PrinterPage/`                                                              |
| — advertisement            | `settings/advertisement`                                                                      | `pages/Settings/AdvertismentSettings.tsx`                                                  |
| — revenue streams          | `settings/revenue-streams`                                                                    | `pages/Settings/RevenueStreamManagement/StreamManagement.tsx`                              |
| — table QR codes           | `settings/table-qr-codes`                                                                     | `pages/Settings/TableQrCodes.tsx`                                                          |
| Dev/scratch                | `test`                                                                                        | `TestComponent.tsx`                                                                        |

## Pattern for new list-style admin pages

Follow Inventory/Expense/PrinterPage/UserActions: a `columns.tsx` (TanStack Table column defs) + `data-table.tsx` (table shell) pair inside the feature folder.

**When adding a new page/route**, follow `.agents/skills/cafe-new-feature/SKILL.md` and update this table.
