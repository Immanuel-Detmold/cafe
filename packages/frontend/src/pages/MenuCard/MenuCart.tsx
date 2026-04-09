import { OrdersAndItemsV2 } from '@/data/useOrders'
import { Product } from '@/data/useProducts'
import { centsToEuro } from '@/generalHelperFunctions/currencyHelperFunction'
import { supabase } from '@/services/supabase'
import { AlertTriangle, ShoppingCart, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useToast } from '@/components/ui/use-toast'

import { getOpenOrdersCount } from '../NewOrder/utilityFunctions/getInventoryCount'
import { calcCartItemPrice, useMenuCart } from './MenuCartContext'
import MenuCheckout from './MenuCheckout'
import { addTrackedOrder } from './orderTrackingStore'

const MenuCart = ({
  products,
  openOrders,
}: {
  products: Product[]
  openOrders?: OrdersAndItemsV2
}) => {
  const { items, removeItem, clearCart, totalPrice, itemCount } = useMenuCart()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [showCheckout, setShowCheckout] = useState(false)
  const [isCreatingTestOrder, setIsCreatingTestOrder] = useState(false)

  const total = totalPrice(products)

  /** Compute available stock for a product (stock minus open orders in queue) */
  const getAvailableStock = (product: Product): number | null => {
    if (product.stock == null) return null
    const queued = openOrders ? getOpenOrdersCount(product.id, openOrders) : 0
    return product.stock - queued
  }

  /** Sum the quantity of a product across all cart items */
  const getCartQuantity = (productId: number): number =>
    items
      .filter((i) => i.product_id === productId)
      .reduce((sum, i) => sum + i.quantity, 0)

  /** Validate that all cart items are still within available stock */
  const validateStock = (): boolean => {
    for (const product of products) {
      if (!product.show_stock_menu) continue
      const available = getAvailableStock(product)
      if (available == null) continue
      const cartQty = getCartQuantity(product.id)
      if (cartQty > 0 && available <= 0) {
        console.log(
          `Product ${product.name} is out of stock (available: ${available}, in cart: ${cartQty})`,
        )
        toast({
          title: `${product.name} ist leider ausverkauft. Bitte entferne es aus dem Warenkorb. ❌`,
        })
        return false
      }
      if (cartQty > 0 && cartQty > available) {
        toast({
          title: `${product.name} ist nicht mehr in ausreichender Menge verfügbar (${available} übrig). Bitte passe deinen Warenkorb an. ❌`,
        })
        return false
      }
    }
    return true
  }

  if (showCheckout) {
    return (
      <MenuCheckout
        products={products}
        customerName={customerName}
        onBack={() => setShowCheckout(false)}
      />
    )
  }

  return (
    <>
      {/* Floating cart button */}
      <button
        onClick={() => setOpen(true)}
        className="bg-primary text-primary-foreground fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
      >
        <ShoppingCart className="h-6 w-6" />
        {itemCount > 0 && (
          <Badge className="bg-destructive text-destructive-foreground absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full p-0 text-xs">
            {itemCount}
          </Badge>
        )}
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Warenkorb ({itemCount})
            </SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-muted-foreground">Dein Warenkorb ist leer</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col gap-3 pr-1">
                {items.map((item) => {
                  const product = products.find((p) => p.id === item.product_id)
                  const itemPrice = calcCartItemPrice(item, product)

                  return (
                    <div
                      key={item.id}
                      className="flex items-start justify-between rounded-md border p-3"
                    >
                      <div className="flex-1">
                        <p className="font-medium">
                          {product?.name ?? 'Unbekannt'}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Anzahl: {item.quantity}
                        </p>
                        {item.option && (
                          <p className="text-muted-foreground text-sm">
                            {item.option.name}
                          </p>
                        )}
                        {item.extras.length > 0 && (
                          <div className="mt-1">
                            {item.extras.map((extra) => (
                              <p
                                key={extra.id}
                                className="text-muted-foreground text-xs"
                              >
                                + {extra.name} x{extra.quantity ?? 1}
                              </p>
                            ))}
                          </div>
                        )}
                        <p className="mt-1 text-sm font-semibold">
                          {centsToEuro(itemPrice)} €
                        </p>
                        {/* Live stock indicator */}
                        {product &&
                          product.show_stock_menu &&
                          (() => {
                            const available = getAvailableStock(product)
                            if (available == null) return null
                            const cartQty = getCartQuantity(product.id)
                            const overLimit = cartQty > available
                            return (
                              <p
                                className={`mt-1 flex items-center gap-1 text-xs ${overLimit ? 'font-semibold text-red-500' : 'text-gray-400'}`}
                              >
                                {overLimit && (
                                  <AlertTriangle className="h-3 w-3" />
                                )}
                                {available <= 0
                                  ? 'Ausverkauft'
                                  : `Noch ${available} verfügbar`}
                                {overLimit && ` (${cartQty} im Warenkorb)`}
                              </p>
                            )
                          })()}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {items.length > 0 && (
            <SheetFooter className="flex flex-col gap-3 border-t pt-4 sm:flex-col">
              {/* Customer name (optional) */}
              <div className="w-full">
                <Label htmlFor="customer-name" className="text-sm">
                  Name (optional)
                </Label>
                <Input
                  id="customer-name"
                  placeholder="Dein Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Total */}
              <div className="flex w-full items-center justify-between">
                <span className="text-lg font-bold">Gesamt</span>
                <span className="text-lg font-bold">
                  {centsToEuro(total)} €
                </span>
              </div>

              {/* Minimum order warning */}
              {total < 100 && (
                <p className="text-destructive text-sm">
                  Mindestbestellwert: 1,00 € (noch {centsToEuro(100 - total)} €
                  fehlend)
                </p>
              )}

              {/* Pay button */}
              <Button
                className="w-full"
                size="lg"
                disabled={total < 100}
                onClick={() => {
                  if (!validateStock()) return
                  setOpen(false)
                  setShowCheckout(true)
                }}
              >
                Bezahlen
              </Button>

              {/* DEV ONLY: Test order without payment */}
              {import.meta.env.DEV && (
                <Button
                  className="w-full border-dashed"
                  variant="outline"
                  size="lg"
                  disabled={items.length === 0 || isCreatingTestOrder}
                  onClick={async () => {
                    setIsCreatingTestOrder(true)
                    try {
                      const categories = [
                        ...new Set(
                          items.map((item) => {
                            const p = products.find(
                              (pr) => pr.id === item.product_id,
                            )
                            return p?.category ?? ''
                          }),
                        ),
                      ].filter(Boolean)

                      const { data: orderData, error: orderError } =
                        await supabase
                          .from('Orders')
                          .insert({
                            status: 'waiting',
                            price: total,
                            payment_method: 'online',
                            customer_name: customerName || null,
                            custom_price: false,
                            categories,
                            product_ids: items.map((i) =>
                              i.product_id.toString(),
                            ),
                          })
                          .select('id, order_number')
                          .single()

                      if (orderError || !orderData) throw orderError

                      const orderItems = items.map((item) => {
                        const product = products.find(
                          (p) => p.id === item.product_id,
                        )
                        return {
                          order_id: orderData.id,
                          product_id: item.product_id,
                          product_name: product?.name ?? 'Unbekannt',
                          quantity: item.quantity,
                          order_price: calcCartItemPrice(item, product),
                          extras: item.extras,
                          option: item.option,
                          comment: null,
                          finished: false,
                        }
                      })

                      await supabase.from('OrderItems').insert(orderItems)

                      addTrackedOrder({
                        orderId: orderData.id,
                        orderNumber: orderData.order_number,
                        createdAt: new Date().toISOString(),
                      })

                      clearCart()
                      setOpen(false)
                      navigate('/menu/orders')
                    } catch (err) {
                      console.error('Test order failed:', err)
                      alert('Test order failed — check console')
                    } finally {
                      setIsCreatingTestOrder(false)
                    }
                  }}
                >
                  {isCreatingTestOrder
                    ? 'Erstelle...'
                    : '🧪 Test Bestellung (DEV)'}
                </Button>
              )}
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

export default MenuCart
