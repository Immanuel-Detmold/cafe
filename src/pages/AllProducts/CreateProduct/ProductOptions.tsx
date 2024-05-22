/* eslint-disable */
import { Label } from '@radix-ui/react-label'
import { PlusCircleIcon, Trash2Icon } from 'lucide-react'
import { useEffect } from 'react'

import { Input } from '@/components/ui/input'

type Option = {
  name: string
  values: string[]
}

export type ProductDetails = {
  options: Option[]
  extras: string[]
}

type ProductOptionsProps = {
  productDetails: ProductDetails
  setProductDetails: React.Dispatch<React.SetStateAction<ProductDetails>>
}

const ProductOptions: React.FC<ProductOptionsProps> = ({
  productDetails,
  setProductDetails,
}) => {
  // Add Option
  const handleAddOption = () => {
    setProductDetails((prev) => ({
      ...prev,
      options: [...prev.options, { name: '', values: ['', ''] }],
    }))
  }

  const handleNewOptionValue = (optionIndex: number) => {
    setProductDetails((prevState) => {
      // Create a deep copy of the state
      const newOptions = JSON.parse(JSON.stringify(prevState.options))
      if (newOptions[optionIndex]) {
        // Add a new value to the option
        newOptions[optionIndex].values.push('')
      }
      // Return the new state
      return { ...prevState, options: newOptions }
    })
  }

  const handleDeleteOption = (option: Option) => {
    setProductDetails((prevState) => {
      // Find the index of the option in the options array
      const optionIndex = prevState.options.findIndex(
        (opt) =>
          opt.name === option.name &&
          opt.values.every((val, idx) => val === option.values[idx]),
      )

      if (optionIndex !== -1) {
        // Create a deep copy of the state
        const newOptions = JSON.parse(JSON.stringify(prevState.options))
        // Remove the option from the options array
        newOptions.splice(optionIndex, 1)
        // Return the new state
        return { ...prevState, options: newOptions }
      }

      // If the option was not found, return the previous state
      return prevState
    })
  }

  const handleOptionNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const newOptions = [...productDetails.options]
    const option = newOptions[index]

    if (option) {
      option.name = e.target.value
      setProductDetails({ ...productDetails, options: newOptions })
    }
  }

  const handleOptionValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    optionIndex: number,
    valueIndex: number,
  ) => {
    setProductDetails((prevState) => {
      // Create a deep copy of the state
      const newOptions = JSON.parse(JSON.stringify(prevState.options))
      if (
        newOptions[optionIndex] &&
        newOptions[optionIndex].values[valueIndex] !== undefined
      ) {
        // Update the value of the option
        newOptions[optionIndex].values[valueIndex] = e.target.value
      }
      // Return the new state
      return { ...prevState, options: newOptions }
    })
  }

  // Add Extra
  const handleAddExtra = () => {
    setProductDetails((prev) => ({
      ...prev,
      extras: [...prev.extras, ''],
    }))
  }

  const handleInputExtraChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newExtras = [...productDetails.extras]
    newExtras[index] = event.target.value
    setProductDetails({ ...productDetails, extras: newExtras })
  }

  // Remove Extra
  const handleRemoveExtra = (index: number) => {
    const newExtras = [...productDetails.extras]
    newExtras.splice(index, 1)
    setProductDetails({ ...productDetails, extras: newExtras })
  }

  // Use useEffect to update the state
  useEffect(() => {
    // Update the state with product1
    // setProductDetails(product1)
  }, [])

  return (
    <>
      <div className="mt-4">
        <div className="flex">
          <Label className="font-bold">Optionen</Label>
          <PlusCircleIcon
            className="ml-1 cursor-pointer"
            onClick={handleAddOption}
          />
        </div>
        {/* Map Over Options */}
        {productDetails.options?.map((option, index) => (
          <div key={index} className="w-[300px]">
            <div className="flex items-center">
              <Input
                className="mt-2 w-[270px]"
                defaultValue={option.name}
                placeholder="Name der Option"
                onChange={(e) => handleOptionNameChange(e, index)}
              />
              <Trash2Icon
                className="ml-2 cursor-pointer"
                onClick={() => handleDeleteOption(option)}
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              {option.values?.map((value, valueIndex) => (
                <Input
                  className="ml-4 mt-1"
                  defaultValue={value}
                  placeholder="Wert der Option"
                  onChange={(e) =>
                    handleOptionValueChange(e, index, valueIndex)
                  }
                  key={valueIndex}
                />
              ))}
              <PlusCircleIcon
                className="ml-2 mt-2 cursor-pointer"
                onClick={() => {
                  handleNewOptionValue(index)
                }}
              />
            </div>
          </div>
        ))}

        <div className="mb-2 mt-4 flex items-center">
          <Label className="font-bold">Extras</Label>{' '}
          <PlusCircleIcon
            className="ml-1 cursor-pointer"
            onClick={handleAddExtra}
          />
        </div>
        {/* Map Over Extras */}
        {productDetails.extras?.map((extra, index) => (
          <div className="mt-1 flex w-[300px] items-center" key={index}>
            <Input
              key={index}
              defaultValue={extra}
              className="ml-2"
              placeholder="Zutat"
              onChange={(event) => handleInputExtraChange(index, event)}
            />
            <Trash2Icon
              onClick={() => handleRemoveExtra(index)}
              className="ml-2 cursor-pointer"
            >
              🗑️
            </Trash2Icon>
          </div>
        ))}
      </div>
    </>
  )
}

export default ProductOptions
