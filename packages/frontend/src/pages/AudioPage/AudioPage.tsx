import { useAppData, useUpdateAppData } from '@/data/useAppData'
import { useUser } from '@/data/useUser'
import { Json } from '@/services/supabase.types'
import { Label } from '@radix-ui/react-label'
import { InfoIcon, Loader2Icon, PlayCircleIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

const AudioPage = () => {
  // Sates
  const [isLoading, setIsLoading] = useState(false)
  const { access_token } = useUser()
  const [ip, setIp] = useState('')
  const [port, setPort] = useState('')

  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [voice, setVoice] = useState('nova')
  const [inputValue, setInputValue] = useState('')

  // Mini Functions
  const { toast } = useToast()

  // Data
  const { data: appData } = useAppData()

  // Mutation
  const { mutate: updateAppData } = useUpdateAppData()

  // Functions
  const handleSendText = async () => {
    if (!inputValue) {
      toast({ title: 'Bitte gib einen Text ein.', duration: 2000 })
      return
    }
    setIsLoading(true) // Start loading
    const requestURL = `http://${ip}:${port}/text-to-speech`
    try {
      const response = await fetch(requestURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ text: inputValue, voice: voice }),
      })

      if (response.ok) {
        const data = (await response.json()) as Json
        toast({ title: (data as { message: string }).message, duration: 2000 })
        setIsLoading(false)
      } else {
        toast({ title: 'Connection failed ❌', duration: 2000 })
      }
      setIsLoading(false)
    } catch (error) {
      toast({ title: 'Connection failed ❌', duration: 2000 })
    } finally {
      setIsLoading(false)
    }
  }

  // Change Default Voice
  const changeDefaultVoice = (voice: string) => {
    updateAppData({ key: 'voice', value: voice })
  }

  // UseEffects
  useEffect(() => {
    const serverIpData = appData?.find((item) => item.key === 'server_ip')
    const serverPortData = appData?.find((item) => item.key === 'server_port')
    const defaultVoice = appData?.find((item) => item.key === 'voice')

    if (serverIpData) {
      setIp(serverIpData.value)
    }
    if (serverPortData) {
      setPort(serverPortData.value)
    }
    if (defaultVoice) {
      setVoice(defaultVoice.value)
    }
  }, [appData])

  return (
    <>
      <div className="mt-2 flex flex-col items-center">
        <div className="w-full max-w-xl">
          <div className="mt-2 flex flex-col">
            <label htmlFor="textInput" className="font-bold">
              Nachricht
            </label>
            <Input
              id="textInput"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="mt-1"
              placeholder="Enter text"
            />

            {/* Select Voic */}
            <label htmlFor="textInput" className="mt-2 font-bold">
              Stimme
            </label>

            {/* Unit */}
            <Select
              onOpenChange={(isOpen) => setIsSelectOpen(isOpen)}
              onValueChange={(value) => {
                setVoice(value)
                changeDefaultVoice(value)
              }}
              defaultValue={voice}
              value={voice}
            >
              <SelectTrigger className="w-full rounded-md">
                <SelectValue placeholder="Stimme" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Wähle eine Stimme</SelectLabel>
                  <SelectItem value="nova">Nova</SelectItem>
                  <SelectItem value="alloy">Alloy</SelectItem>
                  <SelectItem value="echo">Echo</SelectItem>
                  <SelectItem value="fable">Fable</SelectItem>
                  <SelectItem value="onyx">Onyx</SelectItem>
                  <SelectItem value="shimmer">Shimmer</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              onClick={handleSendText}
              disabled={isSelectOpen}
              className="mt-4"
            >
              <PlayCircleIcon />{' '}
              <Label className="ml-1 cursor-pointer">
                {isLoading ? <Loader2Icon className="animate-spin" /> : 'Send'}
              </Label>
            </Button>
          </div>

          <Alert className="mt-4">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Die hier ausgewählte Stimme wird als Standardstimme für alle
              Bestellungen verwendet.
            </AlertDescription>
          </Alert>

          <Alert className="mt-4">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Pro Monat können ca. 28 Audioanfragen generiert werden.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </>
  )
}

export default AudioPage
