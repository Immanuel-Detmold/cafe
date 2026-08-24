import {
  DEFAULT_TABLE_COUNT,
  getTableNumbers,
  useAppData,
  useUpdateAppData,
} from '@/data/useAppData'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { FileTextIcon, PrinterIcon, UtensilsCrossed } from 'lucide-react'
import QRCodeStyling from 'qr-code-styling'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'

import TableQrCodesPDF from './GeneratePDF/TableQrCodesPDF'
import { buildTableQrOptions } from './tableQrCodeStyle'

const getTableUrl = (menuBaseUrl: string, tableNumber: string) =>
  `${menuBaseUrl}?table=${tableNumber}`

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })

const TableQrCodes = () => {
  const { data: appData } = useAppData()
  const { mutate: updateAppData } = useUpdateAppData()
  const { toast } = useToast()
  const tableNumbers = useMemo(() => getTableNumbers(appData), [appData])
  const menuBaseUrl = useMemo(() => {
    const link = appData?.find((item) => item.key === 'menu_link')?.value
    return (
      link?.replace(/\/$/, '') ||
      `${window.location.origin}${import.meta.env.BASE_URL}menu`
    )
  }, [appData])

  const [tableCount, setTableCount] = useState(String(DEFAULT_TABLE_COUNT))
  const [tableNumberSelectable, setTableNumberSelectable] = useState(true)

  const containerRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [qrImages, setQrImages] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!appData) return
    const count = appData.find((item) => item.key === 'table_count')
    const selectable = appData.find(
      (item) => item.key === 'table_number_selectable',
    )
    if (count) setTableCount(count.value)
    setTableNumberSelectable(selectable?.value !== 'false')
  }, [appData])

  const handleTableCountUpdate = () => {
    const parsed = parseInt(tableCount, 10)
    if (!Number.isFinite(parsed) || parsed < 1) {
      toast({ title: 'Anzahl Tische muss eine Zahl größer als 0 sein! ❌' })
      setTableCount(String(DEFAULT_TABLE_COUNT))
      return
    }
    updateAppData(
      { key: 'table_count', value: String(parsed) },
      {
        onSuccess: () => {
          toast({ title: 'Anzahl Tische gespeichert! ✅', duration: 2000 })
        },
        onError: () => {
          toast({ title: 'Fehler beim Speichern! ❌' })
        },
      },
    )
  }

  const handleTableNumberSelectableChange = (checked: boolean) => {
    setTableNumberSelectable(checked)
    updateAppData(
      { key: 'table_number_selectable', value: checked ? 'true' : 'false' },
      {
        onSuccess: () => {
          toast({ title: 'Einstellung gespeichert! ✅', duration: 2000 })
        },
        onError: () => {
          toast({ title: 'Fehler beim Speichern! ❌' })
        },
      },
    )
  }

  useEffect(() => {
    let cancelled = false
    setQrImages({})

    tableNumbers.forEach(async (n) => {
      const container = containerRefs.current[n]
      if (!container) return
      container.replaceChildren()

      const qr = new QRCodeStyling(
        buildTableQrOptions(n, getTableUrl(menuBaseUrl, n)),
      )
      qr.append(container)
      const canvasEl = container.querySelector('canvas')
      if (canvasEl) {
        canvasEl.style.width = '100%'
        canvasEl.style.height = '100%'
      }

      const blob = await qr.getRawData('png')
      if (cancelled || !blob) return
      const dataUrl = await blobToDataUrl(blob as Blob)
      if (cancelled) return
      setQrImages((prev) => ({ ...prev, [n]: dataUrl }))
    })

    return () => {
      cancelled = true
    }
  }, [tableNumbers, menuBaseUrl])

  const qrImagesList = tableNumbers
    .map((n) => ({ table: n, dataUrl: qrImages[n] }))
    .filter((img): img is { table: string; dataUrl: string } =>
      Boolean(img.dataUrl),
    )
  const pdfReady =
    tableNumbers.length > 0 && qrImagesList.length === tableNumbers.length

  return (
    <div className="mx-2 mt-4">
      <div className="print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label className="text-xl font-bold">Tisch-QR-Codes</Label>
          <div className="flex gap-2">
            <Button onClick={() => window.print()} variant="outline">
              <PrinterIcon className="mr-1 h-4 w-4" />
              Drucken
            </Button>
            {pdfReady ? (
              <PDFDownloadLink
                document={<TableQrCodesPDF qrImages={qrImagesList} />}
                fileName="tisch-qr-codes.pdf"
              >
                {({ loading }) => (
                  <Button disabled={loading}>
                    <FileTextIcon className="mr-1 h-4 w-4" />
                    {loading ? 'PDF wird erstellt…' : 'PDF herunterladen'}
                  </Button>
                )}
              </PDFDownloadLink>
            ) : (
              <Button disabled variant="secondary">
                <FileTextIcon className="mr-1 h-4 w-4" />
                PDF wird vorbereitet…
              </Button>
            )}
          </div>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          Jeder QR-Code führt direkt zur Menükarte mit der jeweiligen
          Tischnummer und zeigt sie mittig im Code. Als PDF herunterladen oder
          zum Aushängen an den Tischen ausdrucken.
        </p>

        <div className="bg-background mt-4 max-w-md space-y-4 rounded-lg border p-4">
          <div className="space-y-2">
            <Label
              htmlFor="tableCount"
              className="flex items-center text-sm font-medium"
            >
              <UtensilsCrossed className="mr-2 h-4 w-4" />
              Anzahl Tische
            </Label>
            <Input
              id="tableCount"
              type="number"
              min={1}
              value={tableCount}
              onChange={(e) => setTableCount(e.target.value)}
              onBlur={handleTableCountUpdate}
              placeholder="30"
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="table-number-selectable" className="pr-4">
              Tischnummer für Kunden auswählbar
            </Label>
            <Switch
              id="table-number-selectable"
              checked={tableNumberSelectable}
              onCheckedChange={handleTableNumberSelectableChange}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 print:grid-cols-2 print:gap-8">
        {tableNumbers.map((n) => (
          <div
            key={n}
            className="flex flex-col items-center gap-2 rounded-lg border p-4 print:break-inside-avoid"
          >
            <div
              ref={(el) => {
                containerRefs.current[n] = el
              }}
              className="h-40 w-40 overflow-hidden"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TableQrCodes
