import {
  TtsKeyTest,
  useSetTtsKeyMutation,
  useTestTtsKeyMutation,
  useTtsKeyStatusQuery,
} from '@/data/useTts'
import { format } from 'date-fns'
import { KeyRoundIcon, Loader2Icon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

export const formatUsd = (value: number) =>
  `$${value.toFixed(value > 0 && value < 0.1 ? 4 : 2)}`

const KeyTestResult = ({ test }: { test: TtsKeyTest }) => (
  <div className="rounded-md border p-2 text-sm">
    <div>Key gültig ✅{test.label ? ` (${test.label})` : ''}</div>
    {test.balance !== null && <div>Guthaben: {formatUsd(test.balance)}</div>}
    {test.limitRemaining !== null && (
      <div>Key-Limit übrig: {formatUsd(test.limitRemaining)}</div>
    )}
    {test.usage !== null && <div>Verbraucht: {formatUsd(test.usage)}</div>}
  </div>
)

const OpenRouterKeyCard = () => {
  const { toast } = useToast()
  const [keyInput, setKeyInput] = useState('')
  const [lastTest, setLastTest] = useState<TtsKeyTest | null>(null)

  const { data: status, isLoading } = useTtsKeyStatusQuery()
  const { mutate: setKey, isPending: isSaving } = useSetTtsKeyMutation()
  const { mutate: testKey, isPending: isTesting } = useTestTtsKeyMutation()

  const handleSave = () => {
    if (!keyInput.trim()) return
    setKey(keyInput, {
      onSuccess: (data) => {
        setKeyInput('')
        setLastTest(data.test)
        toast({ title: 'OpenRouter-Key gespeichert ✅', duration: 2000 })
      },
      onError: (error) => {
        toast({ title: `Key nicht gespeichert: ${error.message} ❌` })
      },
    })
  }

  const handleTest = () => {
    testKey(undefined, {
      onSuccess: (data) => setLastTest(data),
      onError: (error) => {
        setLastTest(null)
        toast({ title: `Key-Test fehlgeschlagen: ${error.message} ❌` })
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <KeyRoundIcon className="h-5 w-5" /> OpenRouter-Key
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="text-muted-foreground text-sm">
          {isLoading
            ? 'Lade…'
            : status?.hasKey
              ? `Hinterlegt: ${status.hint} (geändert ${format(new Date(status.updatedAt ?? ''), 'dd.MM.yyyy HH:mm')})`
              : 'Noch kein Key hinterlegt.'}
        </div>
        <div className="flex gap-2">
          <Input
            type="password"
            autoComplete="off"
            placeholder="sk-or-v1-…"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
          />
          <Button onClick={handleSave} disabled={!keyInput.trim() || isSaving}>
            {isSaving ? <Loader2Icon className="animate-spin" /> : 'Speichern'}
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={handleTest}
          disabled={!status?.hasKey || isTesting}
        >
          {isTesting ? <Loader2Icon className="animate-spin" /> : 'Key testen'}
        </Button>
        {lastTest && <KeyTestResult test={lastTest} />}
        <p className="text-muted-foreground text-xs">
          Der Key wird vor dem Speichern geprüft und ist danach nur noch für den
          Server lesbar.
        </p>
      </CardContent>
    </Card>
  )
}

export default OpenRouterKeyCard
