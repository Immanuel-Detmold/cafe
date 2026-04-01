import { Product } from '@/data/useProducts'
import { ProductExtra, Variation } from '@/lib/customTypes'
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

export type CartItem = {
  id: string
  product_id: number
  quantity: number
  extras: ProductExtra[]
  option: Variation | null
}

type MenuCartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  clearCart: () => void
  totalPrice: (products: Product[]) => number
  itemCount: number
}

const MenuCartContext = createContext<MenuCartContextType | null>(null)

const STORAGE_KEY = 'menuCart'

const loadCart = (): CartItem[] => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as CartItem[]) : []
  } catch {
    return []
  }
}

const saveCart = (items: CartItem[]) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export const calcCartItemPrice = (
  item: CartItem,
  product: Product | undefined,
): number => {
  if (!product) return 0
  const basePrice = item.option ? parseFloat(item.option.price) : product.price
  const extrasPrice = item.extras.reduce((sum, extra) => {
    return sum + parseFloat(extra.price) * (extra.quantity ?? 1)
  }, 0)
  return Math.round((basePrice + extrasPrice) * item.quantity)
}

export const MenuCartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(loadCart)

  useEffect(() => {
    saveCart(items)
  }, [items])

  const addItem = useCallback((item: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 8),
    }
    setItems((prev) => [...prev, newItem])
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalPrice = useCallback(
    (products: Product[]) => {
      return items.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.product_id)
        return sum + calcCartItemPrice(item, product)
      }, 0)
    },
    [items],
  )

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <MenuCartContext.Provider
      value={{ items, addItem, removeItem, clearCart, totalPrice, itemCount }}
    >
      {children}
    </MenuCartContext.Provider>
  )
}

export const useMenuCart = () => {
  const ctx = useContext(MenuCartContext)
  if (!ctx) throw new Error('useMenuCart must be used within MenuCartProvider')
  return ctx
}
