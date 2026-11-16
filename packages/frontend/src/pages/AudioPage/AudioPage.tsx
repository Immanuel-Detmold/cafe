import {
  useAudioTemplatesQuery,
  useCreateAudioTemplateMutation,
} from '@/data/useAudioTemplates'
import { pickupText, ttsAudioId, useTtsAudioQuery } from '@/data/useTts'
import { useUser } from '@/data/useUser'
import { format } from 'date-fns'
import {
  BellRingIcon,
  BookmarkPlusIcon,
  Loader2Icon,
  PencilIcon,
  PlayIcon,
  Settings2Icon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

import { voiceLabel } from '../Settings/VoiceSettings/VoiceStudioCard'
import TemplatesCard from './TemplatesCard'
import { useSpeaker } from './useSpeaker'

const RECENT_COUNT = 5

const AudioPage = () => {
  const { toast } = useToast()
  const { user } = useUser()
  const role = user?.user_metadata?.role as string | undefined
  const canManageVoice = ['admin', 'manager'].includes(role ?? '')

  const { tts, speak, replay, playingKey } = useSpeaker()
  const { data: templates } = useAudioTemplatesQuery()
  const { data: audios } = useTtsAudioQuery()
  const { mutate: createTemplate, isPending: isSavingTemplate } =
    useCreateAudioTemplateMutation()

  const [orderNumber, setOrderNumber] = useState('')
  const [text, setText] = useState('')

  // Which template texts already exist as audio for the active voice
  const [readyTexts, setReadyTexts] = useState<Set<string>>(new Set())
  useEffect(() => {
    if (!templates || !audios) return
    const ids = new Set(audios.map((a) => a.id))
    void Promise.all(
      templates.map(async (t) =>
        ids.has(await ttsAudioId(tts.model, tts.voice, t.text))
          ? t.text.trim()
          : null,
      ),
    ).then((ready) => setReadyTexts(new Set(ready.filter((t) => t !== null))))
  }, [templates, audios, tts.model, tts.voice])

  const templateTexts = new Set(templates?.map((t) => t.text.trim()))
  const recent = (audios ?? [])
    .filter(
      (a) =>
        a.kind === 'custom' && a.last_played_at && !templateTexts.has(a.text),
    )
    .sort((a, b) =>
      (b.last_played_at ?? '').localeCompare(a.last_played_at ?? ''),
    )
    .slice(0, RECENT_COUNT)

  const number = Number(orderNumber)
  const isValidNumber = Number.isInteger(number) && number >= 1 && number <= 99

  const handleCallNumber = () => {
    if (!isValidNumber) return
    void speak('pickup', pickupText(number), 'pickup', number)
  }

  const handleSaveTemplate = () => {
    createTemplate(text, {
      onSuccess: () =>
        toast({ title: 'Als Vorlage gespeichert ✅', duration: 2000 }),
      onError: (error) =>
        toast({ title: `Vorlage nicht gespeichert: ${error.message} ❌` }),
    })
  }

  return (
    <div className="mt-2 flex flex-col items-center">
      <div className="flex w-full max-w-xl flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <div className="text-muted-foreground text-sm">
            Stimme: <span className="font-medium">{voiceLabel(tts.voice)}</span>
          </div>
          {canManageVoice && (
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/settings/voice">
                <Settings2Icon className="mr-1 h-4 w-4" /> Stimmen & Audios
              </Link>
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BellRingIcon className="h-5 w-5" /> Abholnummer aufrufen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                handleCallNumber()
              }}
            >
              <Input
                type="number"
                inputMode="numeric"
                min={1}
                max={99}
                placeholder="Nr."
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="h-12 w-28 text-center text-xl"
              />
              <Button
                type="submit"
                className="h-12 flex-1"
                disabled={!isValidNumber || playingKey !== null}
              >
                {playingKey === 'pickup' ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <PlayIcon className="mr-1" />
                )}
                {isValidNumber ? `„${pickupText(number)}“` : 'Aufrufen'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Eigene Durchsage</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Text eingeben, z. B. „Das Café schließt in 10 Minuten.“"
              rows={3}
            />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button
                className="h-12"
                onClick={() => void speak('text', text, 'custom')}
                disabled={!text.trim() || playingKey !== null}
              >
                {playingKey === 'text' ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <PlayIcon className="mr-1" />
                )}
                Abspielen
              </Button>
              <Button
                variant="outline"
                className="h-12"
                onClick={handleSaveTemplate}
                disabled={
                  !text.trim() ||
                  templateTexts.has(text.trim()) ||
                  isSavingTemplate
                }
              >
                <BookmarkPlusIcon className="mr-1" /> Als Vorlage speichern
              </Button>
            </div>
            <p className="text-muted-foreground text-xs">
              Neue Texte werden einmal erzeugt (ein paar Sekunden), danach
              spielen sie sofort.
            </p>
          </CardContent>
        </Card>

        <TemplatesCard
          templates={templates ?? []}
          readyTexts={readyTexts}
          playingKey={playingKey}
          onPlay={(t) => void speak(`template-${t.id}`, t.text, 'custom')}
        />

        {recent.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Zuletzt abgespielt</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {recent.map((audio) => (
                <div
                  key={audio.id}
                  className="flex items-center gap-2 rounded-md border p-2"
                >
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-10 w-10 shrink-0"
                    onClick={() => void replay(audio.id)}
                    disabled={playingKey !== null}
                    aria-label="Nochmal abspielen"
                  >
                    {playingKey === audio.id ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      <PlayIcon />
                    )}
                  </Button>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{audio.text}</div>
                    <div className="text-muted-foreground text-xs">
                      {format(
                        new Date(audio.last_played_at ?? ''),
                        'dd.MM. HH:mm',
                      )}
                      {audio.voice !== tts.voice &&
                        ` · ${voiceLabel(audio.voice)}`}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="In Textfeld übernehmen"
                    onClick={() => setText(audio.text)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AudioPage
