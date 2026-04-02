import { Product } from '@/data/useProducts'
import { centsToEuro } from '@/generalHelperFunctions/currencyHelperFunction'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { useState } from 'react'

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

import { calcCartItemPrice, useMenuCart } from './MenuCartContext'
import MenuCheckout from './MenuCheckout'

const MenuCart = ({ products }: { products: Product[] }) => {
  const { items, removeItem, totalPrice, itemCount } = useMenuCart()
  const [open, setOpen] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [showCheckout, setShowCheckout] = useState(false)

  const total = totalPrice(products)

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

              {/* Pay button */}
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  setOpen(false)
                  setShowCheckout(true)
                }}
              >
                Bezahlen
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

export default MenuCart
