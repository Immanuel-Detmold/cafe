import { queryClient } from '@/App'
import { AppData } from '@/data/useAppData'
import { saveUserAction } from '@/data/useUserActions'
import { supabase } from '@/services/supabase'
import { Database } from '@/services/supabase.types'
import { FunctionsHttpError } from '@supabase/supabase-js'
import { useMutation, useQuery } from '@tanstack/react-query'

// Text-to-speech: audio is generated once via the `tts` edge function
// (OpenRouter), stored in the `tts-audio` bucket / "TtsAudio" table and played
// by the Pi5 server (`POST /play`). See docs/PI5_SERVER.md.

export type TtsAudio = Database['public']['Tables']['TtsAudio']['Row']
export type TtsKind = 'pickup' | 'sample' | 'custom'

export const DEFAULT_TTS_MODEL = 'microsoft/mai-voice-2.1-flash'
export const DEFAULT_TTS_VOICE = 'de-DE-Mia:MAI-Voice-2.1-Flash'
export const PICKUP_NUMBERS = Array.from({ length: 99 }, (_, i) => i + 1)

export const pickupText = (orderNumber: number | string) =>
  `Bestellnummer ${orderNumber} ist abholbereit!`

/** Active model/voice from AppData (`tts_model`, `voice`). */
export const getTtsSettings = (appData: AppData) => ({
  model:
    appData?.find((item) => item.key === 'tts_model')?.value ||
    DEFAULT_TTS_MODEL,
  voice:
    appData?.find((item) => item.key === 'voice')?.value || DEFAULT_TTS_VOICE,
})

/** Must match audioId() in packages/supabase/functions/tts/index.ts */
export const ttsAudioId = async (
  model: string,
  voice: string,
  text: string,
) => {
  const bytes = new TextEncoder().encode(`${model}\n${voice}\n${text.trim()}`)
  const hash = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

const invokeTts = async <T,>(body: Record<string, unknown>): Promise<T> => {
  const { data, error } = await supabase.functions.invoke<T>('tts', { body })
  if (error) {
    if (error instanceof FunctionsHttpError) {
      const payload = (await error.context.json()) as { error?: string }
      throw new Error(payload.error ?? error.message)
    }
    throw error
  }
  if (!data) throw new Error('No data returned')
  return data
}

// --- OpenRouter key -------------------------------------------------------

export type TtsKeyStatus = {
  hasKey: boolean
  hint: string | null
  updatedAt: string | null
}

export type TtsKeyTest = {
  ok: boolean
  label: string | null
  usage: number | null
  limit: number | null
  limitRemaining: number | null
  balance: number | null
}

export const useTtsKeyStatusQuery = () =>
  useQuery({
    queryKey: ['ttsKey'],
    queryFn: () => invokeTts<TtsKeyStatus>({ action: 'key-status' }),
  })

export const useSetTtsKeyMutation = () =>
  useMutation({
    mutationFn: (key: string) =>
      invokeTts<{ hint: string; test: TtsKeyTest }>({
        action: 'set-key',
        key,
      }),
    onSuccess: async (data) => {
      await saveUserAction({
        action: { hint: data.hint },
        short_description: 'OpenRouter-Key geändert',
      })
      await queryClient.invalidateQueries({ queryKey: ['ttsKey'] })
    },
  })

export const useTestTtsKeyMutation = () =>
  useMutation({
    mutationFn: () => invokeTts<TtsKeyTest>({ action: 'test-key' }),
  })

// --- Models & voices (public OpenRouter list, no key needed) --------------

export type TtsModel = {
  id: string
  name: string
  voices: string[]
  /** USD per character, null when the model is priced per token */
  pricePerChar: number | null
}

type OpenRouterModel = {
  id: string
  name: string
  supported_voices?: string[]
  pricing: { prompt: string; completion: string }
}

export const useTtsModelsQuery = () =>
  useQuery({
    queryKey: ['ttsModels'],
    queryFn: async (): Promise<TtsModel[]> => {
      const res = await fetch(
        'https://openrouter.ai/api/v1/models?output_modalities=speech',
      )
      if (!res.ok) throw new Error(`OpenRouter ${res.status}`)
      const { data } = (await res.json()) as { data: OpenRouterModel[] }
      return data
        .filter((m) => m.supported_voices?.length)
        .map((m) => ({
          id: m.id,
          name: m.name,
          voices: m.supported_voices ?? [],
          pricePerChar:
            Number(m.pricing.completion) === 0
              ? Number(m.pricing.prompt)
              : null,
        }))
        .sort((a, b) => a.name.localeCompare(b.name))
    },
    staleTime: 60 * 60 * 1000,
  })

// --- Audio library ----------------------------------------------------------

export const useTtsAudioQuery = () =>
  useQuery({
    queryKey: ['ttsAudio'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('TtsAudio')
        .select()
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })

type GenerateParams = {
  text: string
  model: string
  voice: string
  kind: TtsKind
  orderNumber?: number
  pinned?: boolean
}

/** Generates (or returns the cached) audio. Does not invalidate, see callers. */
export const generateTtsAudio = (params: GenerateParams) =>
  invokeTts<{ audio: TtsAudio; cached: boolean }>({
    action: 'generate',
    ...params,
  })

export const useGenerateTtsMutation = () =>
  useMutation({
    mutationFn: generateTtsAudio,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ttsAudio'] })
    },
  })

export const useUpdateTtsAudioMutation = () =>
  useMutation({
    mutationFn: async ({ ids, pinned }: { ids: string[]; pinned: boolean }) => {
      const { error } = await supabase
        .from('TtsAudio')
        .update({ pinned })
        .in('id', ids)
      if (error) throw error
    },
    onSuccess: async (_, { ids, pinned }) => {
      await saveUserAction({
        action: { ids, pinned },
        short_description: pinned
          ? `${ids.length} Audio(s) angepinnt`
          : `${ids.length} Audio(s) nicht mehr angepinnt`,
      })
      await queryClient.invalidateQueries({ queryKey: ['ttsAudio'] })
    },
  })

export const useDeleteTtsAudioMutation = () =>
  useMutation({
    mutationFn: async (audios: TtsAudio[]) => {
      const { error: storageError } = await supabase.storage
        .from('tts-audio')
        .remove(audios.map((a) => a.storage_path))
      if (storageError) throw storageError
      const { error } = await supabase
        .from('TtsAudio')
        .delete()
        .in(
          'id',
          audios.map((a) => a.id),
        )
      if (error) throw error
    },
    onSuccess: async (_, audios) => {
      await saveUserAction({
        action: audios.map((a) => ({ text: a.text, voice: a.voice })),
        short_description: `${audios.length} Audio(s) gelöscht`,
      })
      await queryClient.invalidateQueries({ queryKey: ['ttsAudio'] })
    },
  })

// --- Playback ----------------------------------------------------------------

// Only one preview plays at a time: a new click stops the previous one.
let previewPlayer: HTMLAudioElement | null = null
let previewRequest = 0

/** Plays an audio in this browser (preview), stopping any preview still playing. */
export const playInBrowser = async (audio: TtsAudio) => {
  const request = ++previewRequest
  previewPlayer?.pause()
  const { data, error } = await supabase.storage
    .from('tts-audio')
    .createSignedUrl(audio.storage_path, 60 * 60)
  if (error) throw error
  // A later click won while the URL was loading.
  if (request !== previewRequest) return
  previewPlayer?.pause()
  previewPlayer = new Audio(data.signedUrl)
  await previewPlayer.play().catch((e: unknown) => {
    // pause() during loading rejects play() with AbortError: not a failure.
    if ((e as Error).name !== 'AbortError') throw e
  })
}

const postPlay = async (ip: string, accessToken: string, id: string) => {
  try {
    return await fetch(`${ip}/play`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ id }),
    })
  } catch {
    throw new Error('Keine Verbindung zum Pi-Server')
  }
}

const throwIfFailed = async (res: Response) => {
  if (res.ok) return
  const payload = (await res.json().catch(() => ({}))) as { error?: string }
  throw new Error(payload.error ?? `Pi-Server antwortet ${res.status}`)
}

/** Plays an already generated audio on the café speaker (Pi5). */
export const playOnSpeaker = async (
  ip: string,
  accessToken: string,
  id: string,
) => throwIfFailed(await postPlay(ip, accessToken, id))

/**
 * Plays `text` on the café speaker. Cache hit: one request to the Pi, no
 * OpenRouter cost. Cache miss: generate once via the edge function, then play.
 */
export const announce = async ({
  ip,
  accessToken,
  ...params
}: GenerateParams & { ip: string; accessToken: string }) => {
  const id = await ttsAudioId(params.model, params.voice, params.text)
  let res = await postPlay(ip, accessToken, id)
  if (res.status === 404) {
    await generateTtsAudio(params)
    void queryClient.invalidateQueries({ queryKey: ['ttsAudio'] })
    res = await postPlay(ip, accessToken, id)
  }
  await throwIfFailed(res)
}
