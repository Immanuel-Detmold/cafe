export const imgPlaceHolder =
  'https://hmwxeqgcfhhumndveboe.supabase.co/storage/v1/object/public/ProductImages/placeholder2%20HQ.jpg'

export const PAYMENT_METHODS = [
  {
    name: 'cash',
    label: 'Bar',
  },
  {
    name: 'terminal',
    label: 'Terminal',
  },
  {
    name: 'paypal',
    label: 'Paypal',
  },
  {
    name: 'cafe_card',
    label: 'Café Karte',
  },
  {
    name: 'free_drink',
    label: 'Freigetränk',
  },
  {
    name: 'online',
    label: 'Online',
  },
]

export const TitleMap = {
  '/admin/login': 'Login',
  '/admin/me': 'Me',
  '/admin/open': 'Offen',
  '/admin/ready-for-pickup': 'Abholbereit',
  '/admin/new-order': 'Neue Bestellung',
  '/admin/all-products': 'Alle Produkte',
  '/admin/statistic': 'Statistik',
  '/admin/Login': 'Login',
  '/admin/closed-orders': 'Abgeholt (Heute)',
  '/admin/cafe-cards': 'Cafe Karten',
  '/admin/settings': 'Einstellungen',
  '/admin/settings/user-actions': 'Benutzeraktionen',
  '/admin/create-product': 'Produkt erstellen',
  '/admin/inventory': 'Inventar',
  '/admin/inventory/new-item': 'Neues Item',
  '/admin/settings/network': 'Netzwerk',
  '/admin/settings/printer': 'Drucker',
  '/admin/audio': 'Audio',
  '/admin/settings/manage-users': 'Benutzer verwalten',
  '/admin/settings/advertisement': 'Werbung verwalten',
  '/admin/expense': 'Ausgaben',
  '/admin/settings/organisation': 'Verwaltung',
}

export const MONTHS = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
]

export const language = 'de'

// Quick-select swatches for the category color picker. The stored value is
// always a raw hex string — these are just curated shortcuts; users can also
// pick any other RGB color freely.
export const CATEGORY_COLOR_PRESETS = [
  { value: '#f59e0b', label: 'Amber' },
  { value: '#0ea5e9', label: 'Himmelblau' },
  { value: '#10b981', label: 'Smaragdgrün' },
  { value: '#8b5cf6', label: 'Violett' },
  { value: '#f43f5e', label: 'Rosé' },
  { value: '#14b8a6', label: 'Türkis' },
  { value: '#f97316', label: 'Orange' },
  { value: '#6366f1', label: 'Indigo' },
  { value: '#ef4444', label: 'Rot' },
  { value: '#3b82f6', label: 'Blau' },
  { value: '#22c55e', label: 'Grün' },
  { value: '#eab308', label: 'Gelb' },
  { value: '#a855f7', label: 'Lila' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#06b6d4', label: 'Cyan' },
  { value: '#84cc16', label: 'Limette' },
  { value: '#d946ef', label: 'Fuchsia' },
  { value: '#6b7280', label: 'Grau' },
  { value: '#8b5e3c', label: 'Kaffee' },
  { value: '#b87333', label: 'Karamell' },
  { value: '#c8ad7f', label: 'Beige' },
  { value: '#3c2415', label: 'Espresso' },
  { value: '#6f4e37', label: 'Mokka' },
  { value: '#d2b48c', label: 'Latte' },
  { value: '#f5e6ca', label: 'Sahne' },
  { value: '#a0522d', label: 'Zimt' },
  { value: '#4a2c2a', label: 'Schokolade' },
  { value: '#f3e5ab', label: 'Vanille' },
  { value: '#e2c290', label: 'Sand' },
  { value: '#c76b4a', label: 'Terrakotta' },
] as const

// Fallback rotation for categories that don't have a color set yet
export const DEFAULT_CATEGORY_COLORS = CATEGORY_COLOR_PRESETS.map(
  (c) => c.value,
)
