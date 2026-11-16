import { queryClient } from '@/App'
import { useUpdateAppData } from '@/data/useAppData'
import {
  PICKUP_NUMBERS,
  TtsAudio,
  TtsModel,
  announce,
  generateTtsAudio,
  pickupText,
  playInBrowser,
  useGenerateTtsMutation,
} from '@/data/useTts'
import { saveUserAction } from '@/data/useUserActions'
import {
  CheckIcon,
  HeadphonesIcon,
  Loader2Icon,
  MicIcon,
  Volume2Icon,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

import { formatUsd } from './OpenRouterKeyCard'

/** Voice ids like "de-DE-Mia:MAI-Voice-2.1-Flash" → "de-DE-Mia" */
export const voiceLabel = (voice: string) => voice.split(':')[0]

const PARALLEL_REQUESTS = 3

type Props = {
  models: TtsModel[]
  model: string
  voice: string
  setModel: (model: string) => void
  setVoice: (voice: string) => void
  active: { model: string; voice: string }
  audios: TtsAudio[]
  ip: string
  accessToken: string
}

const VoiceStudioCard = ({
  models,
  model,
  voice,
  setModel,
  setVoice,
  active,
  audios,
  ip,
  accessToken,
}: Props) => {
  const { toast } = useToast()
  const [sampleText, setSampleText] = useState(pickupText(42))
  const [germanOnly, setGermanOnly] = useState(true)
  const [isPlayingSpeaker, setIsPlayingSpeaker] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)

  const { mutate: generate, isPending: isGenerating } = useGenerateTtsMutation()
  const { mutateAsync: updateAppData, isPending: isSavingActive } =
    useUpdateAppData()

  const selectedModel = models.find((m) => m.id === model)
  const hasGermanVoices = !!selectedModel?.voices.some((v) =>
    v.startsWith('de-'),
  )
  const voices = (selectedModel?.voices ?? []).filter(
    (v) => !germanOnly || !hasGermanVoices || v.startsWith('de-'),
  )
  const isActive = model === active.model && voice === active.voice

  const missingNumbers = useMemo(() => {
    const existing = new Set(
      audios
        .filter(
          (a) => a.kind === 'pickup' && a.model === model && a.voice === voice,
        )
        .map((a) => a.order_number),
    )
    return PICKUP_NUMBERS.filter((n) => !existing.has(n))
  }, [audios, model, voice])

  const estimate = (texts: string[]) =>
    selectedModel?.pricePerChar != null
      ? formatUsd(
          texts.reduce((sum, t) => sum + t.length, 0) *
            selectedModel.pricePerChar,
        )
      : 'Preis pro Token'

  const showError = (error: Error) =>
    toast({ title: `Fehler: ${error.message} ❌` })

  const handleListen = () => {
    generate(
      { text: sampleText, model, voice, kind: 'sample' },
      {
        onSuccess: ({ audio }) => playInBrowser(audio).catch(showError),
        onError: showError,
      },
    )
  }

  const handleSpeaker = async () => {
    setIsPlayingSpeaker(true)
    try {
      await announce({
        ip,
        accessToken,
        text: sampleText,
        model,
        voice,
        kind: 'sample',
      })
    } catch (error) {
      showError(error as Error)
    } finally {
      setIsPlayingSpeaker(false)
    }
  }

  const handleSetActive = async () => {
    try {
      await updateAppData({ key: 'tts_model', value: model })
      await updateAppData({ key: 'voice', value: voice })
      await saveUserAction({
        action: { model, voice },
        short_description: `Standardstimme: ${voiceLabel(voice)}`,
      })
      toast({ title: 'Standardstimme gespeichert ✅', duration: 2000 })
    } catch (error) {
      showError(error as Error)
    }
  }

  const handleGenerateSet = async () => {
    const todo = [...missingNumbers]
    let done = 0
    setProgress(0)
    const worker = async () => {
      for (let n = todo.shift(); n !== undefined; n = todo.shift()) {
        await generateTtsAudio({
          text: pickupText(n),
          model,
          voice,
          kind: 'pickup',
          orderNumber: n,
          pinned: true,
        })
        done++
        setProgress(done)
      }
    }
    try {
      await Promise.all(Array.from({ length: PARALLEL_REQUESTS }, worker))
      await saveUserAction({
        action: { model, voice, count: done },
        short_description: `Abholansagen erzeugt: ${voiceLabel(voice)}`,
      })
      toast({ title: `${done} Abholansagen erzeugt ✅`, duration: 2000 })
    } catch (error) {
      todo.length = 0
      showError(error as Error)
    } finally {
      setProgress(null)
      await queryClient.invalidateQueries({ queryKey: ['ttsAudio'] })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MicIcon className="h-5 w-5" /> Stimmen-Studio
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div>
          <label className="text-sm font-bold">Modell</label>
          <Select
            value={model}
            onValueChange={(value) => {
              setModel(value)
              const next = models.find((m) => m.id === value)
              const german = next?.voices.find((v) => v.startsWith('de-'))
              setVoice(german ?? next?.voices[0] ?? '')
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Modell wählen" />
            </SelectTrigger>
            <SelectContent>
              {models.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                  {m.pricePerChar != null &&
                    ` · ${formatUsd(m.pricePerChar * 1000)} / 1.000 Zeichen`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold">Stimme</label>
            {hasGermanVoices && (
              <label className="flex items-center gap-1 text-sm">
                <Checkbox
                  checked={germanOnly}
                  onCheckedChange={(checked) => setGermanOnly(!!checked)}
                />
                Nur deutsche Stimmen
              </label>
            )}
          </div>
          <Select value={voice} onValueChange={setVoice}>
            <SelectTrigger>
              <SelectValue placeholder="Stimme wählen" />
            </SelectTrigger>
            <SelectContent>
              {voices.map((v) => (
                <SelectItem key={v} value={v}>
                  {voiceLabel(v)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-bold">Probetext</label>
          <Input
            value={sampleText}
            onChange={(e) => setSampleText(e.target.value)}
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Einmal erzeugt, danach kostenlos abspielbar · ≈{' '}
            {estimate([sampleText])}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button
            onClick={handleListen}
            disabled={!voice || !sampleText.trim() || isGenerating}
          >
            {isGenerating ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <HeadphonesIcon />
            )}
            <span className="ml-1">Hier anhören</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleSpeaker}
            disabled={!voice || !sampleText.trim() || isPlayingSpeaker}
          >
            {isPlayingSpeaker ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <Volume2Icon />
            )}
            <span className="ml-1">Auf Lautsprecher</span>
          </Button>
        </div>

        {isActive ? (
          <Badge className="w-fit">
            <CheckIcon className="mr-1 h-4 w-4" /> Aktive Standardstimme
          </Badge>
        ) : (
          <Button
            variant="secondary"
            onClick={handleSetActive}
            disabled={!voice || isSavingActive}
          >
            Als Standardstimme für Ansagen setzen
          </Button>
        )}

        <div className="rounded-md border p-3">
          <div className="font-bold">Abholansagen 1–99</div>
          <p className="text-muted-foreground text-sm">
            „{pickupText('X')}“ – für diese Stimme{' '}
            {PICKUP_NUMBERS.length - missingNumbers.length}/99 vorhanden.
            Fertige Sets werden auf dem Pi vorgeladen und spielen sofort.
          </p>
          {progress !== null && (
            <div className="bg-muted mt-2 h-2 w-full rounded">
              <div
                className="bg-primary h-2 rounded transition-all"
                style={{
                  width: `${(progress / missingNumbers.length) * 100}%`,
                }}
              />
            </div>
          )}
          {missingNumbers.length > 0 && (
            <Button
              className="mt-2 w-full"
              onClick={handleGenerateSet}
              disabled={!voice || progress !== null}
            >
              {progress !== null
                ? `Erzeuge… ${progress}/${missingNumbers.length}`
                : `${missingNumbers.length} fehlende erzeugen (≈ ${estimate(missingNumbers.map(pickupText))})`}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default VoiceStudioCard
