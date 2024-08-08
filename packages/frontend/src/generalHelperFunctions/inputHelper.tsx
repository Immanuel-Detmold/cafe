// Enter Price
// -> 200 -> 2,00   2000 -> 20,00, 20000 -> 200,00
export const onPriceChange = (inputValue: string) => {
  inputValue = inputValue.replace(/\D/g, '')
  const p = inputValue.replace(',', '')
  const l = p.substring(-2, p.length - 2)
  const r = p.substring(p.length - 2, p.length)
  inputValue = l + ',' + r
  if (inputValue === ',') inputValue = ''
  return inputValue
}
