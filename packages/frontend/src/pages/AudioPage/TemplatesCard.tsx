import {
  AudioTemplate,
  useDeleteAudioTemplateMutation,
  useUpdateAudioTemplateMutation,
} from '@/data/useAudioTemplates'
import {
  Loader2Icon,
  PencilIcon,
  PlayIcon,
  Trash2Icon,
  ZapIcon,
} from 'lucide-react'
import { useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

type Props = {
  templates: AudioTemplate[]
  /** Template texts that already exist as audio for the active voice */
  readyTexts: Set<string>
  playingKey: string | null
  onPlay: (template: AudioTemplate) => void
}

const TemplatesCard = ({
  templates,
  readyTexts,
  playingKey,
  onPlay,
}: Props) => {
  const { toast } = useToast()
  const [editing, setEditing] = useState<AudioTemplate | null>(null)
  const [editText, setEditText] = useState('')
  const [deleting, setDeleting] = useState<AudioTemplate | null>(null)

  const { mutate: updateTemplate, isPending: isUpdating } =
    useUpdateAudioTemplateMutation()
  const { mutate: deleteTemplate } = useDeleteAudioTemplateMutation()

  const handleUpdate = () => {
    if (!editing || !editText.trim()) return
    updateTemplate(
      { id: editing.id, text: editText },
      {
        onSuccess: () => {
          setEditing(null)
          toast({ title: 'Vorlage gespeichert ✅', duration: 2000 })
        },
        onError: (error) =>
          toast({ title: `Vorlage nicht gespeichert: ${error.message} ❌` }),
      },
    )
  }

  const handleDelete = () => {
    if (!deleting) return
    deleteTemplate(deleting.id, {
      onSuccess: () => toast({ title: 'Vorlage gelöscht ✅', duration: 2000 }),
      onError: (error) =>
        toast({ title: `Vorlage nicht gelöscht: ${error.message} ❌` }),
    })
    setDeleting(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Vorlagen</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {templates.length === 0 && (
          <p className="text-muted-foreground text-sm">
            Noch keine Vorlagen. Schreib oben einen Text und speichere ihn als
            Vorlage.
          </p>
        )}
        {templates.map((template) => {
          const key = `template-${template.id}`
          const isReady = readyTexts.has(template.text.trim())
          return (
            <div
              key={template.id}
              className="flex items-center gap-2 rounded-md border p-2"
            >
              <Button
                size="icon"
                className="h-12 w-12 shrink-0"
                onClick={() => onPlay(template)}
                disabled={playingKey !== null}
                aria-label="Abspielen"
              >
                {playingKey === key ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <PlayIcon />
                )}
              </Button>
              <div className="min-w-0 flex-1">
                <div className="text-sm">{template.text}</div>
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                  {isReady ? (
                    <>
                      <ZapIcon className="h-3 w-3" /> sofort bereit
                    </>
                  ) : (
                    'wird beim ersten Abspielen erzeugt (ein paar Sekunden)'
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Bearbeiten"
                onClick={() => {
                  setEditing(template)
                  setEditText(template.text)
                }}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Löschen"
                onClick={() => setDeleting(template)}
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </div>
          )
        })}
      </CardContent>

      <Dialog
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vorlage bearbeiten</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Abbrechen
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={!editText.trim() || isUpdating}
            >
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Vorlage löschen?</AlertDialogTitle>
            <AlertDialogDescription>„{deleting?.text}“</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

export default TemplatesCard
