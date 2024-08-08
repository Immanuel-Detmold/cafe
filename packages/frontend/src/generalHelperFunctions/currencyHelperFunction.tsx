export const centsToEuro = (priceInCent: number) => {
  const value = (priceInCent / 100).toFixed(2).toString().replace('.', ',')
  return value
}

export const EuroToCents = (priceInEuro: string | number): number => {
  const value = priceInEuro.toString().replace(',', '').replace('.', '')

  return parseInt(value)
}
