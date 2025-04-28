import { saveUserAction } from '@/data/useUserActions.tsx'
import { supabase } from '@/services/supabase'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

// Definiere den Typ für Audio Templates
type AudioTemplate = {
  id: number
  created_at: string
  text: string
  user_id: string | null
}

// Hook für Audio Templates
const useAudioTemplatesQuery = () => {
  return useQuery({
    queryKey: ['audioTemplates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('AudioTemplates')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return data as AudioTemplate[]
    },
  })
}

// Hook zum Speichern eines Templates
const useCreateTemplateMutation = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (text: string) => {
      const { data, error } = await supabase
        .from('AudioTemplates')
        .insert({ text })
        .select()

      if (error) {
        throw error
      }

      return data[0] as AudioTemplate
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['audioTemplates'] })
      toast({
        title: 'Template gespeichert',
      })

      await saveUserAction({
        action: data,
        short_description: `Audio-Template erstellt: ${data.text.substring(0, 20)}...`,
      })
    },
    onError: (error) => {
      toast({
        title: 'Fehler beim Speichern',
        description: error.message,
      })
    },
  })
}

// Hook zum Aktualisieren eines Templates
const useUpdateTemplateMutation = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, text }: { id: number; text: string }) => {
      const { data, error } = await supabase
        .from('AudioTemplates')
        .update({ text })
        .eq('id', id)
        .select()

      if (error) {
        throw error
      }

      return data[0] as AudioTemplate
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['audioTemplates'] })
      toast({
        title: 'Template aktualisiert',
      })

      await saveUserAction({
        action: data,
        short_description: `Audio-Template aktualisiert: ${data.text.substring(0, 20)}...`,
      })
    },
    onError: (error) => {
      toast({
        title: 'Fehler beim Aktualisieren',
        description: error.message,
      })
    },
  })
}

// Hook zum Löschen eines Templates
const useDeleteTemplateMutation = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: number) => {
      const { data, error } = await supabase
        .from('AudioTemplates')
        .delete()
        .eq('id', id)
        .select()

      if (error) {
        throw error
      }

      return data[0] as AudioTemplate
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['audioTemplates'] })
      toast({
        title: 'Template gelöscht',
      })

      await saveUserAction({
        action: data,
        short_description: `Audio-Template gelöscht: ${data.text.substring(0, 20)}...`,
      })
    },
    onError: (error) => {
      toast({
        title: 'Fehler beim Löschen',
        description: error.message,
      })
    },
  })
}

// Hauptkomponente für Audio Templates
interface AudioTemplatesProps {
  onSelectTemplate: (text: string) => void
}

export function AudioTemplates({ onSelectTemplate }: AudioTemplatesProps) {
  const { data: templates, isLoading, error } = useAudioTemplatesQuery()
  const createMutation = useCreateTemplateMutation()
  const updateMutation = useUpdateTemplateMutation()
  const deleteMutation = useDeleteTemplateMutation()

  const [newTemplate, setNewTemplate] = useState('')
  const [editTemplate, setEditTemplate] = useState<AudioTemplate | null>(null)
  const [editText, setEditText] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const handleCreateTemplate = () => {
    if (newTemplate.trim()) {
      createMutation.mutate(newTemplate)
      setNewTemplate('')
      setIsOpen(false)
    }
  }

  const handleOpenEdit = (template: AudioTemplate) => {
    setEditTemplate(template)
    setEditText(template.text)
    setIsEditOpen(true)
  }

  const handleUpdateTemplate = () => {
    if (editTemplate && editText.trim()) {
      updateMutation.mutate({
        id: editTemplate.id,
        text: editText,
      })
      setEditTemplate(null)
      setEditText('')
      setIsEditOpen(false)
    }
  }

  const handleDeleteTemplate = (id: number) => {
    if (confirm('Möchtest du dieses Template wirklich löschen?')) {
      deleteMutation.mutate(id)
    }
  }

  if (isLoading) return <div>Lade Templates...</div>
  if (error) return <div>Fehler beim Laden der Templates: {error.message}</div>

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Audio Templates</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neues Template</DialogTitle>
              <DialogDescription>
                Erstelle einen neuen Template-Text für die Audio-Ausgabe
              </DialogDescription>
            </DialogHeader>
            <Input
              value={newTemplate}
              onChange={(e) => setNewTemplate(e.target.value)}
              placeholder="Template-Text eingeben..."
              className="mt-4"
            />
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleCreateTemplate}>Speichern</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {templates && templates.length > 0 ? (
            templates.map((template) => (
              <div
                key={template.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => onSelectTemplate(template.text)}
                >
                  {template.text}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenEdit(template)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground py-4 text-center">
              Keine Templates vorhanden. Erstelle dein erstes Template.
            </div>
          )}
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Template bearbeiten</DialogTitle>
            <DialogDescription>Ändere den Text des Templates</DialogDescription>
          </DialogHeader>
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="Template-Text eingeben..."
            className="mt-4"
          />
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleUpdateTemplate}>Aktualisieren</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
