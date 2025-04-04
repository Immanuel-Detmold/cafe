import { queryClient } from '@/App'
import { supabase } from '@/services/supabase'
import { Database } from '@/services/supabase.types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { v4 as uuidv4 } from 'uuid'

import { saveUserAction } from './useUserActions.tsx'

export type Product = Database['public']['Tables']['Products']['Row']

export const useProductsQuery = ({
  searchTerm,
  ascending,
  categories,
  advertisement,
  only_advertisement_screen,
  paused,
}: {
  searchTerm: string
  ascending?: boolean
  categories?: string[]
  advertisement?: boolean
  only_advertisement_screen?: boolean
  paused?: boolean
}) => {
  return useQuery({
    queryKey: [
      'products',
      searchTerm,
      ascending,
      categories,
      advertisement,
      only_advertisement_screen,
      paused,
    ],
    queryFn: async () => {
      let query = supabase
        .from('Products')
        .select()
        .eq('deleted', false)
        .order('name', { ascending })
        .ilike('name', `%${searchTerm}%`)

      if (categories && categories.length > 0) {
        query = query.in('category', categories)
      }

      if (advertisement !== undefined) {
        query = query.eq('advertisement', true)
      }

      if (only_advertisement_screen !== undefined) {
        query = query.eq('only_advertisement_screen', only_advertisement_screen)
      }

      if (paused !== undefined) {
        query = query.eq('paused', paused)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }
      return data
    },
  })
}

// Get only one Product - Not used in this project
export const useProductQuery = ({ id }: { id: string | undefined }) =>
  useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (id === undefined) {
        return null
      }
      const { data, error } = await supabase
        .from('Products')
        .select()
        .eq('id', parseInt(id))
        .single()

      if (error) {
        throw error
      }
      return data
    },
  })

// Makes soft delete -> set deleted to true
export const useDeleteProductMutation = () =>
  useMutation({
    mutationFn: async (product: Product) => {
      const { data: productData, error } = await supabase
        .from('Products')
        .update({ deleted: true })
        .eq('id', product.id)
        .select()

      if (error) {
        throw error
      }

      // If img exist -> remove from supabase storage
      if (product.image) {
        // Extract ImgID from URL
        const parts = product.image.split('/')
        const imgId = parts[parts.length - 1]
        const { error: removeError } = await supabase.storage
          .from('ProductImages')
          .remove([`${imgId}`])

        if (removeError) {
          throw removeError
        }
      }

      // If Images exist, delete images from storage
      if (product.images) {
        const product_id = product.id.toString()
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

      return productData
    },
    onSuccess: async (data) => {
      // After the mutation succeeds, invalidate the useProductsQuery
      await queryClient.invalidateQueries({ queryKey: ['products', 'product'] })

      await saveUserAction({
        action: data,
        short_description: `Delteted Product: ${data[0]?.name}`,
      })
    },
  })

type InsertProduct = Database['public']['Tables']['Products']['Insert']

export const useCreateProductMutation = () =>
  useMutation({
    mutationFn: async (newProduct: InsertProduct) => {
      const { data, error } = await supabase
        .from('Products')
        .insert(newProduct)
        .select()
        .single()
      if (error) {
        throw error
      }
      return data
    },
    onSuccess: async (data) => {
      // After the mutation succeeds, invalidate the useProductsQuery
      await queryClient.invalidateQueries({ queryKey: ['products'] })

      await saveUserAction({
        action: data,
        short_description: `Created Product: ${data.name}`,
      })
    },
  })

type UpdateProduct = Database['public']['Tables']['Products']['Update']

export const useUpdateProductMutation = (product_id: number) =>
  useMutation({
    mutationFn: async (updatedProduct: UpdateProduct) => {
      const { data, error } = await supabase
        .from('Products')
        .update(updatedProduct)
        .eq('id', product_id)
        .select()
      if (error) {
        throw error
      }

      return data
    },
    onSuccess: async (data) => {
      // After the mutation succeeds, invalidate the useProductsQuery
      await queryClient.invalidateQueries({ queryKey: ['products'] })

      await saveUserAction({
        action: data,
        short_description: `Edit Product: ${data[0]?.name}`,
      })
    },
  })

// Update Product with id as input to mutation
export const useUpdateProductMutationV2 = () =>
  useMutation({
    mutationFn: async ({
      updatedProduct,
      product_id,
    }: {
      updatedProduct: UpdateProduct
      product_id: number
    }) => {
      const { data, error } = await supabase
        .from('Products')
        .update(updatedProduct)
        .eq('id', product_id)
        .select()

      if (error) {
        throw error
      }

      return data
    },
    onSuccess: async (data) => {
      // After the mutation succeeds, invalidate the useProductsQuery
      await queryClient.invalidateQueries({
        queryKey: ['products', 'product', data[0]?.id],
      })

      await queryClient.refetchQueries({ queryKey: ['products'] })

      await saveUserAction({
        action: data,
        short_description: `Edit Product: ${data[0]?.name}`,
      })
    },
  })

// Get Product images from folder "id"
export const useProductImagesQuery = ({ id }: { id: string | undefined }) =>
  useQuery({
    queryKey: ['productImages', id],
    queryFn: async () => {
      if (id === undefined) {
        return null
      }

      const { data, error } = await supabase.storage
        .from('ProductImages')
        .list(id, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        })

      if (error) {
        throw error
      }
      return data
    },
    enabled: !!id,
  })

// Upload multiple images to folder with "id"
export const useUploadProductImagesMutation = () =>
  useMutation({
    mutationFn: async ({
      product,
      files,
    }: {
      product: Product | null | undefined
      files: File[]
    }) => {
      if (!product) {
        return null
      }
      const urls = []

      // Upload all selected files to Bucket
      for (const file of files) {
        const i_uuidv4 = uuidv4()
        const { data, error } = await supabase.storage
          .from('ProductImages')
          .upload('/' + product.id + '/' + i_uuidv4, file)

        if (error) {
          throw error
        }

        // Get Img Url
        if (data) {
          const { data: urlData } = supabase.storage
            .from('ProductImages')
            .getPublicUrl(product.id + '/' + i_uuidv4)

          urls.push(urlData.publicUrl)
        } else {
          urls.push(i_uuidv4)
        }
      }

      // Update Product with new images

      const new_images = product.images ? product.images.concat(urls) : urls

      const { error } = await supabase
        .from('Products')
        .update({ images: new_images })
        .eq('id', product.id)
        .select()

      if (error) {
        throw error
      }

      return urls
    },
    onSuccess: async () => {
      // After the mutation succeeds, invalidate the useProductImagesQuery
      await queryClient.invalidateQueries({ queryKey: ['productImages'] })
    },
  })

export const useUpdateProductStockMutation = () =>
  useMutation({
    mutationFn: async ({
      product_id,
      newStock,
    }: {
      product_id: number
      newStock: number
    }) => {
      const { data, error } = await supabase
        .from('Products')
        .update({ stock: newStock })
        .eq('id', product_id)
        .select()

      if (error) {
        throw error
      }

      return data
    },
    onSuccess: async (data) => {
      // After the mutation succeeds, invalidate the useProductsQuery
      await queryClient.invalidateQueries({ queryKey: ['products'] })

      await saveUserAction({
        action: data,
        short_description: `Updated Stock for Product: ${data[0]?.name}`,
      })
    },
  })
