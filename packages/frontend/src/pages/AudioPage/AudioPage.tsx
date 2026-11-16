import { getServerIp, useAppData } from '@/data/useAppData'
import { announce, getTtsSettings } from '@/data/useTts'
import { useUser } from '@/data/useUser'
import { Label } from '@radix-ui/react-label'
import { InfoIcon, Loader2Icon, PlayCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { AudioTemplates } from '@/components/AudioTemplates'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

import { voiceLabel } from '../Settings/VoiceSettings/VoiceStudioCard'

const AudioPage = () => {
  // States
  const [isLoading, setIsLoading] = useState(false)
  const { access_token } = useUser()
  const [inputValue, setInputValue] = useState('')

  // Mini Functions
  const { toast } = useToast()

  // Data
  const { data: appData } = useAppData()
  const tts = getTtsSettings(appData)
  const serverIp = appData?.find((item) => item.key === 'server_ip')?.value

  // Functions
  const handleSendText = async () => {
    if (!inputValue.trim()) {
      toast({ title: 'Bitte gib einen Text ein.', duration: 2000 })
      return
    }
    if (!serverIp) {
      toast({ title: 'Keine Server-Adresse hinterlegt ❌' })
      return
    }
    setIsLoading(true)
    try {
      await announce({
        ip: getServerIp(serverIp),
        accessToken: access_token ?? '',
        ...tts,
        text: inputValue,
        kind: 'custom',
      })
      toast({ title: 'Ansage abgespielt ✅', duration: 2000 })
    } catch (error) {
      toast({ title: `Ansage fehlgeschlagen: ${(error as Error).message} ❌` })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectTemplate = (templateText: string) => {
    setInputValue(templateText)
  }

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
              placeholder="Text eingeben"
            />

            <Button onClick={handleSendText} className="mt-4">
              <PlayCircleIcon />{' '}
              <Label className="ml-1 cursor-pointer">
                {isLoading ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  'Abspielen'
                )}
              </Label>
            </Button>
          </div>

          <Alert className="mt-4">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Stimme: {voiceLabel(tts.voice)} ({tts.model}). Jeder Text wird nur
              einmal erzeugt, danach wird er kostenlos abgespielt. Stimme ändern
              und anhören unter{' '}
              <Link to="/admin/settings/voice" className="underline">
                Einstellungen → Sprachausgabe
              </Link>
              .
            </AlertDescription>
          </Alert>

          <AudioTemplates onSelectTemplate={handleSelectTemplate} />
        </div>
      </div>
    </>
  )
}

export default AudioPage
