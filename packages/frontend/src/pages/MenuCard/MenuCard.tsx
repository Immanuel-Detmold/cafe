import { useProductCategories } from '@/data/useProductCategories'
import { useProductsQuery } from '@/data/useProducts'
import { ProductWithVariations } from '@/lib/customTypes'
import { MoreVertical, Share, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

import { groupProductsToCategories } from '../NewOrder/utilityFunctions/groupProductsToCategories'
import MenuCart from './MenuCart'
import { MenuCartProvider } from './MenuCartContext'
import MenuFooter from './MenuFooter'
import MenuProductCard from './MenuProductCard'
import { getTrackedOrders } from './orderTrackingStore'

const MenuCard = () => {
  const [trackedOrders] = useState(() => getTrackedOrders())
  const { toast } = useToast()

  // PWA install prompt
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallHint, setShowInstallHint] = useState(false)
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  const isIOS =
    import.meta.env.DEV ||
    (/iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window))

  useEffect(() => {
    if (isStandalone || localStorage.getItem('pwa-hint-dismissed')) return

    // DEV: always show install hint
    if (import.meta.env.DEV) {
      setShowInstallHint(true)
      return
    }

    if (isIOS) {
      setShowInstallHint(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallHint(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [isStandalone, isIOS])

  const handleInstall = useCallback(() => {
    if (!deferredPrompt) return
    void deferredPrompt.prompt()
    setDeferredPrompt(null)
    setShowInstallHint(false)
  }, [deferredPrompt])

  const dismissInstallHint = () => {
    localStorage.setItem('pwa-hint-dismissed', '1')
    setShowInstallHint(false)
  }

  // Data
  const { data: products, error } = useProductsQuery({
    searchTerm: '',
    ascending: true,
    only_advertisement_screen: false,
    paused: false,
  })
  const { data: dataCategories } = useProductCategories()

  const isDev = import.meta.env.DEV

  let groupedProducts = undefined
  if (dataCategories && products) {
    const filteredCategories = isDev
      ? dataCategories
      : dataCategories.filter((c) => !c.category.toLowerCase().includes('test'))
    const filteredProducts = isDev
      ? products
      : products.filter((p) => !p.name.toLowerCase().includes('test'))
    groupedProducts = groupProductsToCategories(
      filteredCategories,
      filteredProducts as ProductWithVariations[],
    )
  }

  if (error) {
    toast({ title: 'Fehler beim Laden der Produkte! ❌' })
  }

  return (
    <MenuCartProvider>
      {/* Active orders banner */}
      {trackedOrders.length > 0 && (
        <div className="bg-card mx-4 mt-4 flex items-center justify-between gap-4 rounded-lg border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            <span className="text-sm font-medium">
              {trackedOrders.length === 1
                ? 'Offene Bestellung'
                : `${trackedOrders.length} offene Bestellungen`}
            </span>
          </div>
          <Link to="/menu/orders">
            <Button size="sm">Status ansehen</Button>
          </Link>
        </div>
      )}

      {/* PWA install hint */}
      {showInstallHint && (
        <div className="bg-card mx-4 mt-4 flex items-start gap-3 rounded-lg border px-4 py-3">
          <div className="flex-1 text-sm">
            {isIOS ? (
              <p>
                Tippe auf{' '}
                <MoreVertical className="inline h-4 w-4 rotate-90 align-text-bottom" />
                , dann auf{' '}
                <Share className="inline h-4 w-4 align-text-bottom" />{' '}
                <strong>Teilen</strong> und dann auf{' '}
                <strong>{'\u201EZum Home-Bildschirm\u201C'}</strong>, um die App
                zu installieren und Benachrichtigungen zu erhalten.
              </p>
            ) : (
              <p>
                Tippe auf{' '}
                <MoreVertical className="inline h-4 w-4 align-text-bottom" />{' '}
                und dann auf <strong>{'\u201EApp installieren\u201C'}</strong>,
                um die App zu installieren und Benachrichtigungen zu erhalten.
              </p>
            )}
            <div className="mt-2 flex gap-2">
              {!isIOS && deferredPrompt && (
                <Button size="sm" onClick={handleInstall}>
                  Installieren
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={dismissInstallHint}>
                Später
              </Button>
            </div>
          </div>
          <button
            onClick={dismissInstallHint}
            className="text-muted-foreground hover:text-foreground shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="mt-6">
        <h1 className="cinzel-decorative-bold text-center text-4xl">
          Menükarte
        </h1>
      </div>

      <div className="pb-24">
        {Object.entries(groupedProducts ?? {}).map(([category, products]) => (
          <div key={category} className="container mt-2 px-4">
            {/* Category */}
            <h2 className="cinzel-decorative-regular mb-2 mt-6 text-2xl">
              {category}
            </h2>
            {/* Products */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {products.map((product) => (
                <MenuProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ))}

        <div className="mt-16">
          <MenuFooter />
        </div>
      </div>

      {products && <MenuCart products={products} />}
    </MenuCartProvider>
  )
}

export default MenuCard
