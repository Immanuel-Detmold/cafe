import { useAppData, useUpdateAppData } from '@/data/useAppData'
import { Building2, Image, Link } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

export function Organisation() {
  // State für die Organisationsdaten
  const [orgName, setOrgName] = useState('')
  const [orgLogo, setOrgLogo] = useState('')
  const [menuLink, setMenuLink] = useState('')

  // Daten und Mutation Hook
  const { data: appData } = useAppData()
  const { mutate: updateAppData } = useUpdateAppData()
  const { toast } = useToast()

  // Laden der Daten beim Mounten der Komponente
  useEffect(() => {
    if (appData) {
      const name = appData.find((item) => item.key === 'organisation_name')
      const logo = appData.find((item) => item.key === 'organisation_logo')
      const link = appData.find((item) => item.key === 'menu_link')

      if (name) setOrgName(name.value)
      if (logo) setOrgLogo(logo.value)
      if (link) setMenuLink(link.value)
    }
  }, [appData])

  // Funktion zum Aktualisieren der Daten
  const handleUpdate = (key: string, value: string) => {
    if (!value.trim()) {
      toast({
        title: 'Eingabefeld darf nicht leer sein! ❌',
      })
      return
    }

    updateAppData(
      { key, value },
      {
        onSuccess: () => {
          toast({
            title: 'Daten erfolgreich aktualisiert! ✅',
            duration: 2000,
          })
        },
        onError: () => {
          toast({
            title: 'Fehler beim Speichern der Daten! ❌',
          })
        },
      },
    )
  }

  return (
    <div className="bg-background mx-auto w-full max-w-2xl space-y-6 rounded-lg p-6 shadow-md">
      <h2 className="mb-6 text-2xl font-bold">Organisationseinstellungen</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="orgName"
            className="flex items-center text-sm font-medium"
          >
            <Building2 className="mr-2 h-4 w-4" />
            Organisationsname
          </Label>
          <Input
            id="orgName"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            onBlur={() => handleUpdate('organisation_name', orgName)}
            placeholder="Geben Sie den Namen Ihrer Organisation ein"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="orgLogo"
            className="flex items-center text-sm font-medium"
          >
            <Image className="mr-2 h-4 w-4" />
            Logo-URL
          </Label>
          <Input
            id="orgLogo"
            value={orgLogo}
            onChange={(e) => setOrgLogo(e.target.value)}
            onBlur={() => handleUpdate('organisation_logo', orgLogo)}
            placeholder="Fügen Sie die URL Ihres Logos ein"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="menuLink"
            className="flex items-center text-sm font-medium"
          >
            <Link className="mr-2 h-4 w-4" />
            Menü-Link
          </Label>
          <Input
            id="menuLink"
            value={menuLink}
            onChange={(e) => setMenuLink(e.target.value)}
            onBlur={() => handleUpdate('menu_link', menuLink)}
            placeholder="Geben Sie den Link zu Ihrem Menü ein"
            className="w-full"
          />
        </div>

        <Button
          onClick={() => {
            handleUpdate('organisation_name', orgName)
            handleUpdate('organisation_logo', orgLogo)
            handleUpdate('menu_link', menuLink)
          }}
          className="mt-6 w-full"
        >
          Änderungen speichern
        </Button>
      </div>
    </div>
  )
}
