export const hexToRgb = (hex: string): [number, number, number] => {
  const normalized = hex.replace('#', '')
  const r = parseInt(normalized.substring(0, 2), 16)
  const g = parseInt(normalized.substring(2, 4), 16)
  const b = parseInt(normalized.substring(4, 6), 16)
  return [r, g, b]
}

export const hexToRgba = (hex: string, alpha: number): string => {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Relative luminance (WCAG) to decide whether black or white text is legible on a given background
export const getContrastTextColor = (hex: string): string => {
  const [r, g, b] = hexToRgb(hex)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? '#1a1a1a' : '#ffffff'
}

export const isValidHexColor = (value: string): boolean =>
  /^#([0-9A-Fa-f]{6})$/.test(value)
