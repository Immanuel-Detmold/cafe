import {
  TtsAudio,
  playInBrowser,
  playOnSpeaker,
  useDeleteTtsAudioMutation,
  useUpdateTtsAudioMutation,
} from '@/data/useTts'
import { format } from 'date-fns'
import {
  HeadphonesIcon,
  LibraryIcon,
  PinIcon,
  Trash2Icon,
  Volume2Icon,
} from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'

import { voiceLabel } from './VoiceStudioCard'

const KIND_LABELS: Record<string, string> = {
  sample: 'Probe',
  custom: 'Freitext',
}

type Props = {
  audios: TtsAudio[]
  active: { model: string; voice: string }
  ip: string
  accessToken: string
}

type PickupSet = {
  key: string
  model: string
  voice: string
  audios: TtsAudio[]
  plays: number
}

const groupPickupSets = (audios: TtsAudio[]): PickupSet[] => {
  const sets = new Map<string, PickupSet>()
  for (const audio of audios.filter((a) => a.kind === 'pickup')) {
    const key = `${audio.model}\n${audio.voice}`
    const set = sets.get(key) ?? {
      key,
      model: audio.model,
      voice: audio.voice,
      audios: [],
      plays: 0,
    }
    set.audios.push(audio)
    set.plays += audio.play_count
    sets.set(key, set)
  }
  return [...sets.values()]
}

const AudioLibraryCard = ({ audios, active, ip, accessToken }: Props) => {
  const { toast } = useToast()
  const { mutate: updateAudios } = useUpdateTtsAudioMutation()
  const { mutate: deleteAudios } = useDeleteTtsAudioMutation()

  const pickupSets = groupPickupSets(audios)
  // Pinned first; within each group the query's newest-first order stays.
  const singles = audios
    .filter((a) => a.kind !== 'pickup')
    .sort((a, b) => Number(b.pinned) - Number(a.pinned))

  const showError = (error: Error) =>
    toast({ title: `Fehler: ${error.message} ❌` })

  const handleDelete = (items: TtsAudio[]) =>
    deleteAudios(items, {
      onSuccess: () => toast({ title: 'Gelöscht ✅', duration: 2000 }),
      onError: showError,
    })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <LibraryIcon className="h-5 w-5" /> Gespeicherte Audios
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm">
          Angepinnte Audios bleiben dauerhaft. Alles andere wird automatisch
          gelöscht, wenn es 90 Tage nicht abgespielt wurde.
        </p>

        {pickupSets.length > 0 && (
          <div>
            <div className="mb-1 font-bold">Abholansagen-Sets</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stimme</TableHead>
                  <TableHead>Anzahl</TableHead>
                  <TableHead>Gespielt</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {pickupSets.map((set) => (
                  <TableRow key={set.key}>
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-1">
                        {voiceLabel(set.voice)}
                        {set.model === active.model &&
                          set.voice === active.voice && <Badge>aktiv</Badge>}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {set.model}
                      </div>
                    </TableCell>
                    <TableCell>{set.audios.length}/99</TableCell>
                    <TableCell>{set.plays}×</TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Set löschen?</AlertDialogTitle>
                            <AlertDialogDescription>
                              {set.audios.length} Abholansagen mit{' '}
                              {voiceLabel(set.voice)} werden gelöscht und
                              müssten neu erzeugt (und bezahlt) werden.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(set.audios)}
                            >
                              Löschen
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div>
          <div className="mb-1 font-bold">Proben & Freitexte</div>
          {singles.length === 0 ? (
            <p className="text-muted-foreground text-sm">Noch keine.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Text</TableHead>
                  <TableHead>Gespielt</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {singles.map((audio) => (
                  <TableRow key={audio.id}>
                    <TableCell>
                      <div>{audio.text}</div>
                      <div className="text-muted-foreground text-xs">
                        {KIND_LABELS[audio.kind] ?? audio.kind} ·{' '}
                        {voiceLabel(audio.voice)} · {audio.model}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {audio.play_count}×
                      {audio.last_played_at && (
                        <div className="text-muted-foreground text-xs">
                          {format(new Date(audio.last_played_at), 'dd.MM.yy')}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Hier anhören"
                          onClick={() => playInBrowser(audio).catch(showError)}
                        >
                          <HeadphonesIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Auf Lautsprecher"
                          onClick={() =>
                            playOnSpeaker(ip, accessToken, audio.id)
                              .then(() =>
                                toast({
                                  title: 'Durchsage abgespielt ✅',
                                  duration: 2000,
                                }),
                              )
                              .catch(showError)
                          }
                        >
                          <Volume2Icon className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant={audio.pinned ? 'default' : 'ghost'}
                          title={
                            audio.pinned ? 'Nicht mehr anpinnen' : 'Anpinnen'
                          }
                          onClick={() =>
                            updateAudios(
                              { ids: [audio.id], pinned: !audio.pinned },
                              {
                                onSuccess: () =>
                                  toast({
                                    title: audio.pinned
                                      ? 'Nicht mehr angepinnt ✅'
                                      : 'Angepinnt ✅',
                                    description: audio.pinned
                                      ? 'Wird gelöscht, wenn es 90 Tage nicht abgespielt wurde.'
                                      : 'Wird nie automatisch gelöscht und liegt immer auf dem Pi bereit.',
                                    duration: 5000,
                                  }),
                                onError: showError,
                              },
                            )
                          }
                        >
                          <PinIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Löschen"
                          onClick={() => handleDelete([audio])}
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default AudioLibraryCard
