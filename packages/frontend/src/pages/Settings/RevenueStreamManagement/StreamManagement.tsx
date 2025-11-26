import {
  type RevenueStream,
  useCreateRevenueStreamMutation,
  useDeleteRevenueStreamMutation,
  useRevenueStreamsQuery,
  useUpdateRevenueStreamMutation,
} from '@/data/useRevenueStreams'
import {
  ChevronLeftIcon,
  Edit2,
  Loader2,
  Plus,
  Star,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface ColorOption {
  value: string
  label: string
  color: string
}

interface FormData {
  name: string
  description: string
  color: string
  icon: string
}

const colorOptions: ColorOption[] = [
  { value: '#3B82F6', label: 'Blau', color: 'bg-blue-500' },
  { value: '#10B981', label: 'Grün', color: 'bg-green-500' },
  { value: '#8B5CF6', label: 'Lila', color: 'bg-purple-500' },
  { value: '#F59E0B', label: 'Orange', color: 'bg-orange-500' },
  { value: '#EF4444', label: 'Rot', color: 'bg-red-500' },
  { value: '#8B4513', label: 'Braun', color: 'bg-amber-800' },
  { value: '#6B7280', label: 'Grau', color: 'bg-gray-500' },
]

const iconOptions: string[] = [
  '☕',
  '🍰',
  '🥐',
  '🧃',
  '👶',
  '🧑‍🎓',
  '🎉',
  '📚',
  '🎨',
  '⚽',
  '🎵',
  '💼',
  '💰',
  '🎁',
]

export default function RevenueStreamManager(): JSX.Element {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [editingStream, setEditingStream] = useState<RevenueStream | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    color: '#3B82F6',
    icon: '💰',
  })

  // Hooks for data fetching and mutations
  const { data: revenueStreams, isLoading, error } = useRevenueStreamsQuery()
  const createMutation = useCreateRevenueStreamMutation()
  const updateMutation = useUpdateRevenueStreamMutation()
  const deleteMutation = useDeleteRevenueStreamMutation()
  const navigate = useNavigate()

  const handleEdit = (stream: RevenueStream): void => {
    setEditingStream(stream)
    setFormData({
      name: stream.name,
      description: stream.description || '',
      color: stream.color || '',
      icon: stream.icon || '',
    })
    setIsDialogOpen(true)
  }

  const handleCreate = (): void => {
    setEditingStream(null)
    setFormData({
      name: '',
      description: '',
      color: '#3B82F6',
      icon: '💰',
    })
    setIsDialogOpen(true)
  }

  const handleNameChange = (name: string): void => {
    setFormData((prev) => ({
      ...prev,
      name,
    }))
  }

  const handleSubmit = async (): Promise<void> => {
    try {
      if (editingStream) {
        await updateMutation.mutateAsync({
          id: editingStream.id,
          updates: formData,
        })
      } else {
        await createMutation.mutateAsync(formData)
      }
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving revenue stream:', error)
    }
  }

  const handleDelete = async (streamId: number): Promise<void> => {
    try {
      await deleteMutation.mutateAsync(streamId)
    } catch (error) {
      console.error('Error deleting revenue stream:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Lade Umsatzgruppen...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Fehler beim Laden der Umsatzgruppen
      </div>
    )
  }

  return (
    <div className="mt-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Umsatzgruppen verwalten</h2>
          <p className="text-muted-foreground">
            Erstelle und verwalte deine eigenen Umsatzgruppen für bessere
            Organisation
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Neue Gruppe
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingStream
                  ? 'Umsatzgruppe bearbeiten'
                  : 'Neue Umsatzgruppe'}
              </DialogTitle>
              <DialogDescription>
                {editingStream
                  ? 'Bearbeite die Eigenschaften der Umsatzgruppe'
                  : 'Erstelle eine neue Umsatzgruppe für die Organisation deiner Umsätze'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="z.B. Kinderstunden"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Kurze Beschreibung der Umsatzgruppe"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Farbe</Label>
                  <Select
                    value={formData.color}
                    onValueChange={(color: string) =>
                      setFormData((prev) => ({ ...prev, color }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-4 w-4 rounded-full"
                            style={{ backgroundColor: formData.color }}
                          />
                          {
                            colorOptions.find((c) => c.value === formData.color)
                              ?.label
                          }
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-4 w-4 rounded-full ${color.color}`}
                            />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Icon</Label>
                  <Select
                    value={formData.icon}
                    onValueChange={(icon: string) =>
                      setFormData((prev) => ({ ...prev, icon }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue>
                        <span className="text-lg">{formData.icon}</span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <div className="grid max-h-40 grid-cols-6 gap-1 overflow-y-auto p-2">
                        {iconOptions.map((icon) => (
                          <SelectItem
                            key={icon}
                            value={icon}
                            className="cursor-pointer p-2 text-center"
                          >
                            <span className="text-lg">{icon}</span>
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingStream ? 'Speichern' : 'Erstellen'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {revenueStreams?.map((stream) => (
          <Card key={stream.id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{stream.icon}</span>
                  <CardTitle className="text-lg">{stream.name}</CardTitle>
                  {stream.is_default && (
                    <Badge variant="secondary" className="ml-2">
                      <Star className="mr-1 h-3 w-3" />
                      Standard
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(stream)}
                    disabled={updateMutation.isPending}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Umsatzgruppe löschen
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Möchtest du die Umsatzgruppe {stream.name} wirklich
                          löschen? Diese Aktion kann nicht rückgängig gemacht
                          werden.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(stream.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {deleteMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Löschen
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3">
                {stream.description || 'Keine Beschreibung'}
              </CardDescription>
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: stream.color || '' }}
                />
                <span className="text-muted-foreground text-xs">
                  Farbe:{' '}
                  {colorOptions.find((c) => c.value === stream.color)?.label ||
                    'Unbekannt'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-4 flex justify-start">
        <Button
          className="mr-auto"
          onClick={() => {
            navigate('/admin/settings/')
          }}
        >
          <ChevronLeftIcon className="cursor-pointer" />
        </Button>
      </div>
    </div>
  )
}
