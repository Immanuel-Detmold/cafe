// Geräte-lokale Einstellung "Kassenbon drucken" (print_mode).
// Wird im localStorage gespeichert statt in Supabase, da das Drucken
// pro Gerät unterschiedlich konfiguriert sein kann.

const STORAGE_KEY = 'cafe-print-mode'

export const getPrintMode = (): boolean => {
  try {
    // Default: true (nur explizit 'false' deaktiviert das Drucken)
    return localStorage.getItem(STORAGE_KEY) !== 'false'
  } catch {
    return true
  }
}

export const setPrintMode = (value: boolean): void => {
  try {
    localStorage.setItem(STORAGE_KEY, value ? 'true' : 'false')
  } catch {
    /* ignore */
  }
}
