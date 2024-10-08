import { useAppData, useUpdateAppData } from '@/data/useAppData'
import { useUser } from '@/data/useUser'
import { Json } from '@/services/supabase.types'
import { ChevronLeftIcon, Loader2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

const NetworkPage = () => {
  // Sates
  const [isLoading, setIsLoading] = useState(false)
  const { access_token } = useUser()
  const [ip, setIp] = useState('')
  const [port, setPort] = useState('')

  // Mini Functions
  const { toast } = useToast()
  const navigate = useNavigate()

  // Data
  const { data: appData } = useAppData()

  // Mutations
  const { mutate: updateAppData } = useUpdateAppData()

  useEffect(() => {
    const serverIpData = appData?.find((item) => item.key === 'server_ip')
    const serverPortData = appData?.find((item) => item.key === 'server_port')
    if (serverIpData) {
      setIp(serverIpData.value)
    }
    if (serverPortData) {
      setPort(serverPortData.value)
    }
  }, [appData])

  const updateNetwork = () => {
    updateAppData({ key: 'server_ip', value: ip })

    updateAppData(
      { key: 'server_port', value: port },
      {
        onSuccess: () => {
          toast({
            title: 'Netzwerk aktualisiert. ✅',
            duration: 2000,
          })
        },
        onError: () => {
          toast({
            title: 'Fehler beim Aktualisieren der Einstellungen. ❌',
            duration: 2000,
          })
        },
      },
    )
  }

  const testConnection = async () => {
    setIsLoading(true) // Start loading
    const requestURL = `${ip}/test-connection`

    try {
      const response = await fetch(requestURL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })

      if (response.ok) {
        const data = (await response.json()) as Json
        toast({ title: (data as { message: string }).message, duration: 2000 })
      } else {
        toast({ title: 'Connection failed ❌', duration: 2000 })
      }
    } catch (error) {
      toast({ title: 'Connection failed ❌', duration: 2000 })
    } finally {
      setIsLoading(false) // End loading
    }
  }

  return (
    <>
      <div className="mt-2 flex flex-col items-center">
        <div className="w-full max-w-xl">
          <div className="mt-2 flex flex-col">
            <label htmlFor="ip" className="font-bold">
              Server IP Adresse
            </label>
            <Input
              id="ip"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="mt-1"
              placeholder="Enter IP Address"
            />
            {false && (
              <>
                <label htmlFor="port" className="mt-4 font-bold">
                  Server Port (wird nicht gebraucht)
                </label>
                <Input
                  id="port"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  className="mt-1"
                  placeholder="Enter Port"
                />
              </>
            )}
            <div className="flex">
              <Button
                className="mt-4"
                onClick={() => {
                  navigate('/admin/settings')
                }}
              >
                <ChevronLeftIcon className="cursor-pointer" />
              </Button>
              <div className="flex w-full flex-wrap justify-evenly">
                <Button onClick={updateNetwork} className="mt-4">
                  Aktualisiere Netzwerk
                </Button>
                <Button onClick={testConnection} className="mt-4">
                  {isLoading ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    'Verbindungstest'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NetworkPage
