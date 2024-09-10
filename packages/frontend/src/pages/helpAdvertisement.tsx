import { Product } from '@/data/useProducts'

// Mix two arrays together, inserting the second array at every 'step' interval in the first array.
export function mixArrays(products: Product[], slogans: Product[]): Product[] {
  const result: Product[] = []
  const productLength = products.length
  const sloganLength = slogans.length
  if (sloganLength === 0) {
    return products // No slogans to mix, return products as is.
  }
  // Create a step to insert a slogan at every 'step' interval
  const step = Math.floor(productLength / sloganLength) + 1

  let sloganIndex = 0
  for (let i = 0; i < productLength + sloganLength; i++) {
    const currentProduct = products[i]

    if (currentProduct) result.push(currentProduct)

    // Insert a slogan at every 'step' interval
    if ((i + 1) % step === 0 && sloganIndex < sloganLength) {
      const currentSlogan = slogans[sloganIndex]
      if (currentSlogan) result.push(currentSlogan)
      sloganIndex++
    }
  }

  // If there are any remaining slogans that haven't been inserted
  while (sloganIndex < sloganLength) {
    const currentSlogan = slogans[sloganIndex]
    if (currentSlogan) result.push(currentSlogan)
    sloganIndex++
  }
  return result
}

export const getFontSize = (name: string) => {
  // Split string with spaces and get the length of the longest word
  const longestWordLength = name
    .split(' ')
    .reduce((a, b) => (a.length > b.length ? a : b)).length

  // Get the total length of the sentence
  const totalLength = name.length

  // Determine the font size based on the longest word and total length
  if (longestWordLength < 8 && totalLength < 20) {
    return '7.5rem'
  } else if (longestWordLength < 10 && totalLength < 19) {
    return '7rem'
  } else if (longestWordLength < 12 && totalLength < 24) {
    return '6.5rem'
  } else if (longestWordLength < 14 && totalLength < 29) {
    return '6rem'
  } else if (longestWordLength < 16 && totalLength < 34) {
    return '5.5rem'
  } else if (longestWordLength < 18 && totalLength < 39) {
    return '5rem'
  } else if (longestWordLength < 20 && totalLength < 44) {
    return '4.5rem'
  } else if (longestWordLength < 22 && totalLength < 49) {
    return '4rem'
  } else if (longestWordLength < 24 && totalLength < 54) {
    return '3.5rem'
  } else {
    return '3rem' // Default font size for long words or sentences
  }
}
