/* eslint-disable */
import { Button } from './components/ui/button'
import { supabase } from './services/supabase'

const TestComponent = () => {
  const deleteProductImages = async (product_id: string) => {
    // Get images in folder
    const filesData = await supabase.storage
      .from('ProductImages')
      .list(product_id)

    // Delete images one by one in folder
    if (filesData.data) {
      for (const file of filesData.data) {
        const { error } = await supabase.storage
          .from('ProductImages')
          .remove([product_id + '/' + file.name])
        if (error) throw error
      }
    }

    // Delete Folder
    const { error } = await supabase.storage
      .from('ProductImages')
      .remove([product_id])
    if (error) throw error
  }

  return (
    <>
      <div>Test</div>
      <Button
        onClick={() => {
          deleteProductImages('166')
        }}
      >
        Test
      </Button>
    </>
  )
}

export default TestComponent
