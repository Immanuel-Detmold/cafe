import { ProductDetails } from '../../../components/ProductOptions'

export const removeEmptyValues = (ProductDetails: ProductDetails) => {
  let newOptions = ProductDetails.options.map((option) => {
    const newValues = option.values.filter((value) => value !== '')
    return { ...option, values: newValues }
  })

  newOptions = newOptions.filter((option) => option.values.length >= 2)
  const newExtras = ProductDetails.extras.filter((extra) => extra !== '')
  const FilteredProductDetails = { options: newOptions, extras: newExtras }
  return { FilteredProductDetails }
}

export const formatFileSize = (size: number) => {
  if (size > 1048576) {
    return Math.round(size / 1048576) + 'mb'
  } else if (size > 1024) {
    return Math.round(size / 1024) + 'kb'
  } else {
    return size + 'b'
  }
}
