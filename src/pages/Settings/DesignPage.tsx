import { useUser } from '@/data/useUser'
import { supabase } from '@/services/supabase'
import { Label } from '@radix-ui/react-label'
import {
  ChevronDownIcon,
  MoonIcon,
  PaletteIcon,
  SunIcon,
  SunMoonIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { Theme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

const DesignPage = () => {
  const [open, setOpen] = useState(false)
  const [design, setDesign] = useState('')

  const { user } = useUser()
  const { toast } = useToast()

  useEffect(() => {
    const theme = (user?.user_metadata.design ?? 'system') as Theme
    setDesign(theme)
  }, [user])

  const handleSetDesign = async (design: string) => {
    await supabase.auth
      .updateUser({
        data: {
          design,
        },
      })
      .then(() => {
        toast({ title: 'Design gesetzt ✅', duration: 800 })
      })
      .catch(() => {
        toast({ title: 'Fehler beim setzen des Designs ❌', duration: 800 })
      })
  }

  return (
    <>
      <Button
        onClick={() => {
          setOpen(!open)
        }}
      >
        <div className="flex w-full min-w-80 justify-between">
          <div className="flex items-center">
            <PaletteIcon />
            <Label className="ml-1 cursor-pointer">Design</Label>
          </div>
          <ChevronDownIcon className="ml-1" />
        </div>
      </Button>

      {open && (
        <div className="">
          <div className="flex justify-evenly space-x-2">
            <Button
              variant="outline"
              tabIndex={-1}
              className={
                design === 'system'
                  ? 'focus w-full bg-amber-600 text-white focus:bg-amber-600 focus:text-white'
                  : 'w-full focus:outline-none'
              }
              onClick={async () => {
                await handleSetDesign('system')
              }}
            >
              <SunMoonIcon />
              <Label className="ml-1 cursor-pointer font-bold">System</Label>
            </Button>
            <Button
              variant="outline"
              className={
                design === 'light'
                  ? 'focus w-full bg-amber-600 text-white focus:bg-amber-600 focus:text-white'
                  : 'w-full focus:outline-none'
              }
              onClick={async () => {
                await handleSetDesign('light')
              }}
            >
              <SunIcon />
              <Label className="ml-1 cursor-pointer font-bold">Hell</Label>
            </Button>
            <Button
              variant="outline"
              className={
                design === 'dark'
                  ? 'focus w-full bg-amber-600 text-white focus:bg-amber-600 focus:text-white'
                  : 'w-full focus:outline-none'
              }
              onClick={async () => {
                await handleSetDesign('dark')
              }}
            >
              <MoonIcon />
              <Label className="ml-1 cursor-pointer font-bold">Dunkel</Label>
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

export default DesignPage
