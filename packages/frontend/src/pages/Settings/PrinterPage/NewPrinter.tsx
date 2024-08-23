import {
  useCreatePrinterMutation,
  usePrinterQuery,
  useUpdatePrinterMutation,
} from '@/data/usePrinter'
import { useProductCategories } from '@/data/useProductCategories'
import { Label } from '@radix-ui/react-label'
import { ChevronLeftIcon, SaveIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import InfoIconPopover from '@/components/InfoIconPopover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'

import DeletePrinter from './DeletePrinter'

const NewPrinter = () => {
  const [name, setName] = useState('')
  const [ip, setIp] = useState('')
  const [port, setPort] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Hooks
  const navigate = useNavigate()
  const { toast } = useToast()
  const { printerId } = useParams()

  // Data & Mutation
  const { data: categoriesData } = useProductCategories()
  const savePrinterMutation = useCreatePrinterMutation()
  const { mutate: editPrinter } = useUpdatePrinterMutation(
    printerId ? parseInt(printerId) : 0,
  )
  const printerData = usePrinterQuery({ id: printerId ? printerId : '' })

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, category])
    } else {
      setSelectedCategories((prev) => prev.filter((c) => c !== category))
    }
  }
  // Functions
  const handleSavePrinter = () => {
    if (!name || !ip || !port || selectedCategories.length === 0) {
      toast({
        title:
          'Bitte alle Felder ausfüllen. Es muss mindestens eine Kategorie ausgwählt werden.',
      })
      return
    }

    const printer = {
      name,
      ip,
      port,
      categories: selectedCategories,
    }

    // Edit Printer
    if (printerId) {
      editPrinter(printer, {
        onSuccess: () => {
          toast({
            title: 'Drucker erfolgreich aktualisiert ✔',
            duration: 2000,
          })
          navigate('/admin/settings/printer')
        },
        onError: () => {
          toast({
            title: `Fehler beim Aktualisieren des Druckers ❌`,
            duration: 2000,
          })
        },
      })
    } else {
      // Create New Printer
      savePrinterMutation.mutate(printer, {
        onSuccess: () => {
          toast({ title: 'Drucker erfolgreich hinzugefügt ✔' })
          navigate('/admin/settings/printer')
        },
        onError: (error) => {
          console.log(error)
          toast({ title: `Fehler beim speichern des Druckers ❌` })
        },
      })
    }
  }

  // Use Effect, if edit mode, Load printer data
  useEffect(() => {
    if (printerId) {
      const data = printerData.data
      if (data) {
        setName(data.name)
        setIp(data.ip)
        setPort(data.port)
        setSelectedCategories(data.categories)
      }
    }
  }, [printerId, printerData.data])

  return (
    <div className="mt-2 flex flex-col items-center">
      <div className="w-full max-w-xl">
        <div className="mt-2 flex flex-col">
          <Label htmlFor="name" className="font-bold">
            Druckername
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1"
            placeholder="Name des Druckers"
          />

          <Label htmlFor="ip" className="mt-4 font-bold">
            IP-Adresse
          </Label>
          <Input
            id="ip"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            className="mt-1"
            placeholder="IP-Adresse des Druckers"
          />

          <Label htmlFor="port" className="mt-4 font-bold">
            Port
          </Label>
          <Input
            id="port"
            value={port}
            onChange={(e) => setPort(e.target.value.replace(/[^0-9]/g, ''))}
            className="mt-1"
            placeholder="Port des Druckers (üblicherweise 9100)"
          />

          <div className="mb-2 mt-4 flex items-center">
            <Label htmlFor="category" className="font-bold">
              Kategorie
            </Label>
            <InfoIconPopover text="Bon wird gedruckt, wenn in der Bestellung die Kategorie enthalten ist." />
          </div>
          {categoriesData &&
            categoriesData.map((cat) => (
              <div key={cat.id} className="mt-2 flex items-center">
                <Switch
                  id={cat.id.toString()}
                  checked={selectedCategories.includes(cat.category)}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(cat.category, checked)
                  }
                />
                <label htmlFor={cat.id.toString()} className="ml-2">
                  {cat.category}
                </label>
              </div>
            ))}
        </div>

        <div className="mt-4 flex justify-between">
          <div className="flex justify-start">
            <Button
              className="mr-auto"
              onClick={() => {
                navigate('/admin/settings/printer')
              }}
            >
              <ChevronLeftIcon className="cursor-pointer" />
            </Button>
          </div>

          <div className="flex justify-end">
            {printerId && <DeletePrinter printerId={printerId} />}
            <Button onClick={handleSavePrinter} className="ml-2">
              <SaveIcon className="mr-1 cursor-pointer" />
              Speichern
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewPrinter
