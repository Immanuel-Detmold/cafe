import { getServerIp, useAppData } from '@/data/useAppData'
import { TtsKind, announce, getTtsSettings, playOnSpeaker } from '@/data/useTts'
import { useUser } from '@/data/useUser'
import { useState } from 'react'

import { useToast } from '@/components/ui/use-toast'

/**
 * Plays announcements on the café speaker with the active voice. `playingKey`
 * marks the button that is currently playing; the Pi queues overlapping calls.
 */
export const useSpeaker = () => {
  const { toast } = useToast()
  const { access_token } = useUser()
  const { data: appData } = useAppData()
  const tts = getTtsSettings(appData)
  const serverIp = appData?.find((item) => item.key === 'server_ip')?.value
  const [playingKey, setPlayingKey] = useState<string | null>(null)

  const run = async (key: string, play: (ip: string) => Promise<void>) => {
    if (!serverIp) {
      toast({ title: 'Keine Server-Adresse hinterlegt ❌' })
      return
    }
    setPlayingKey(key)
    try {
      await play(getServerIp(serverIp))
      toast({ title: 'Durchsage abgespielt ✅', duration: 2000 })
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
  ) =>
    run(key, (ip) =>
      announce({
        ip,
        accessToken: access_token ?? '',
        ...tts,
        text,
        kind,
        orderNumber,
      }),
    )

  /** Replays a stored audio as it is, whatever voice it was made with. */
  const replay = (id: string) =>
    run(id, (ip) => playOnSpeaker(ip, access_token ?? '', id))

  return { tts, speak, replay, playingKey }
}
