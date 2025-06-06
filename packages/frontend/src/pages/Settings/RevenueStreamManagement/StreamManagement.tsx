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
  Power,
  PowerOff,
  Star,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
import { Switch } from '@/components/ui/switch'
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
  active: boolean
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
]

export default function RevenueStreamManager(): JSX.Element {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [editingStream, setEditingStream] = useState<RevenueStream | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    color: '#3B82F6',
    icon: '💰',
    active: true,
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
      active: stream.active || true,
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
      active: true,
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
    if (window.confirm('Möchtest du diese Umsatzgruppe wirklich löschen?')) {
      try {
        await deleteMutation.mutateAsync(streamId)
      } catch (error) {
        console.error('Error deleting revenue stream:', error)
      }
    }
  }

  const handleToggleActive = async (stream: RevenueStream): Promise<void> => {
    try {
      await updateMutation.mutateAsync({
        id: stream.id,
        updates: { active: !stream.active },
      })
    } catch (error) {
      console.error('Error toggling revenue stream status:', error)
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

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(active: boolean) =>
                    setFormData((prev) => ({ ...prev, active }))
                  }
                />
                <Label htmlFor="active" className="flex items-center gap-2">
                  {formData.active ? (
                    <Power className="h-4 w-4 text-green-600" />
                  ) : (
                    <PowerOff className="h-4 w-4 text-red-600" />
                  )}
                  {formData.active ? 'Aktiv' : 'Inaktiv'}
                </Label>
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
          <Card
            key={stream.id}
            className={`relative ${!stream.active ? 'opacity-60' : ''}`}
          >
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
                  {!stream.active && (
                    <Badge variant="destructive" className="ml-2">
                      Inaktiv
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(stream)}
                    disabled={updateMutation.isPending}
                    title={stream.active ? 'Deaktivieren' : 'Aktivieren'}
                  >
                    {updateMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : stream.active ? (
                      <Power className="h-4 w-4 text-green-600" />
                    ) : (
                      <PowerOff className="h-4 w-4 text-red-600" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(stream)}
                    disabled={updateMutation.isPending}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(stream.id)}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
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
                  {stream.active ? (
                    <span className="font-medium text-green-600">Aktiv</span>
                  ) : (
                    <span className="font-medium text-red-600">Inaktiv</span>
                  )}
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
