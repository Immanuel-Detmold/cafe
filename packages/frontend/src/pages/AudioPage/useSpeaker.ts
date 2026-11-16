import { queryClient } from '@/App'
import { getServerIp, useAppData } from '@/data/useAppData'
import {
  TtsAudio,
  TtsKind,
  announce,
  generateTtsAudio,
  getTtsSettings,
  playInBrowser,
  playOnSpeaker,
} from '@/data/useTts'
import { useUser } from '@/data/useUser'
import { useState } from 'react'

import { useToast } from '@/components/ui/use-toast'

/** Where announcements play: the café speaker (Pi5) or this device (preview). */
export type PlayTarget = 'speaker' | 'device'

/**
 * Plays announcements with the active voice. `playingKey` marks the button
 * that is currently playing; the Pi queues overlapping calls.
 */
export const useSpeaker = () => {
  const { toast } = useToast()
  const { access_token } = useUser()
  const { data: appData } = useAppData()
  const tts = getTtsSettings(appData)
  const serverIp = appData?.find((item) => item.key === 'server_ip')?.value
  const [playingKey, setPlayingKey] = useState<string | null>(null)
  const [target, setTarget] = useState<PlayTarget>('speaker')

  const run = async (
    key: string,
    onSpeaker: (ip: string) => Promise<void>,
    onDevice: () => Promise<void>,
  ) => {
    if (target === 'speaker' && !serverIp) {
      toast({ title: 'Keine Server-Adresse hinterlegt ❌' })
      return
    }
    setPlayingKey(key)
    try {
      if (target === 'device') {
        await onDevice()
      } else {
        await onSpeaker(getServerIp(serverIp ?? ''))
        toast({ title: 'Durchsage abgespielt ✅', duration: 2000 })
      }
    } catch (error) {
      toast({
        title: `Durchsage fehlgeschlagen: ${(error as Error).message} ❌`,
      })
    } finally {
      setPlayingKey(null)
    }
  }

  const speak = (
    key: string,
    text: string,
    kind: TtsKind,
    orderNumber?: number,
  ) => {
    const params = { ...tts, text, kind, orderNumber }
    return run(
      key,
      (ip) => announce({ ip, accessToken: access_token ?? '', ...params }),
      async () => {
        // Same cache as the speaker: generated once, then reused.
        const { audio, cached } = await generateTtsAudio(params)
        if (!cached)
          void queryClient.invalidateQueries({ queryKey: ['ttsAudio'] })
        await playInBrowser(audio)
      },
    )
  }

  /** Replays a stored audio as it is, whatever voice it was made with. */
  const replay = (audio: TtsAudio) =>
    run(
      audio.id,
      (ip) => playOnSpeaker(ip, access_token ?? '', audio.id),
      () => playInBrowser(audio),
    )

  return { tts, speak, replay, playingKey, target, setTarget }
}
