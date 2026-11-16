// Text-to-speech via OpenRouter with a cached audio library.
// Actions: key-status, set-key, test-key, generate (see docs/PI5_SERVER.md).
// The OpenRouter key lives in "AppSecrets" and never leaves this function.
import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

const OPENROUTER_URL = 'https://openrouter.ai/api/v1'
const KEY_NAME = 'openrouter_api_key'
const BUCKET = 'tts-audio'
const MAX_TEXT_LENGTH = 500

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
)

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

// Must match ttsAudioId() in packages/frontend/src/data/useTts.tsx
const audioId = async (model: string, voice: string, text: string) => {
  const bytes = new TextEncoder().encode(`${model}\n${voice}\n${text}`)
  const hash = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

const getKey = async () => {
  const { data, error } = await supabase
    .from('AppSecrets')
    .select('value, updated_at')
    .eq('key', KEY_NAME)
    .maybeSingle()
  if (error) throw error
  return data
}

const keyHint = (key: string) => `${key.slice(0, 6)}…${key.slice(-4)}`

const testKey = async (key: string) => {
  const res = await fetch(`${OPENROUTER_URL}/key`, {
    headers: { Authorization: `Bearer ${key}` },
  })
  if (!res.ok) {
    return { ok: false, error: `OpenRouter ${res.status}: ${await res.text()}` }
  }
  const { data } = (await res.json()) as {
    data: {
      label?: string
      usage?: number
      limit?: number | null
      limit_remaining?: number | null
    }
  }
  // Account balance; not available for every key type, so optional.
  type Credits = { total_credits: number; total_usage: number }
  let credits: Credits | null = null
  const creditsRes = await fetch(`${OPENROUTER_URL}/credits`, {
    headers: { Authorization: `Bearer ${key}` },
  })
  if (creditsRes.ok) {
    credits = ((await creditsRes.json()) as { data: Credits }).data
  }
  return {
    ok: true,
    label: data.label ?? null,
    usage: data.usage ?? null,
    limit: data.limit ?? null,
    limitRemaining: data.limit_remaining ?? null,
    balance: credits ? credits.total_credits - credits.total_usage : null,
  }
}

const extensionFor = (contentType: string) =>
  contentType.includes('wav')
    ? 'wav'
    : contentType.includes('ogg')
      ? 'ogg'
      : 'mp3'

// Raw PCM (Gemini TTS only returns this) → WAV, so browsers and pygame can play it.
// Gemini sends 24 kHz 16-bit mono; a "rate=" in the content type wins if present.
const pcmToWav = (pcm: Uint8Array, contentType: string) => {
  const rate = Number(/rate=(\d+)/.exec(contentType)?.[1] ?? 24000)
  const wav = new Uint8Array(44 + pcm.byteLength)
  const view = new DataView(wav.buffer)
  const ascii = (offset: number, value: string) =>
    [...value].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)))
  ascii(0, 'RIFF')
  view.setUint32(4, 36 + pcm.byteLength, true)
  ascii(8, 'WAVE')
  ascii(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true) // PCM
  view.setUint16(22, 1, true) // mono
  view.setUint32(24, rate, true)
  view.setUint32(28, rate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  ascii(36, 'data')
  view.setUint32(40, pcm.byteLength, true)
  wav.set(pcm, 44)
  return wav
}

const requestSpeech = (
  key: string,
  model: string,
  voice: string,
  text: string,
  format: string,
) =>
  fetch(`${OPENROUTER_URL}/audio/speech`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://immanuel-cafe.de',
      'X-Title': 'Immanuel Cafe',
    },
    body: JSON.stringify({
      model,
      voice,
      input: text,
      response_format: format,
    }),
  })

type GenerateBody = {
  text: string
  model: string
  voice: string
  kind?: 'pickup' | 'sample' | 'custom'
  orderNumber?: number
  pinned?: boolean
}

const generate = async (body: GenerateBody) => {
  const text = body.text?.trim()
  const { model, voice } = body
  if (!text || !model || !voice) {
    return json({ error: 'text, model und voice sind erforderlich' }, 400)
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return json(
      { error: `Text ist länger als ${MAX_TEXT_LENGTH} Zeichen` },
      400,
    )
  }

  const id = await audioId(model, voice, text)
  const { data: existing, error: existingError } = await supabase
    .from('TtsAudio')
    .select()
    .eq('id', id)
    .maybeSingle()
  if (existingError) throw existingError
  if (existing) {
    // Re-generating a set should pin audio that already existed unpinned.
    if (body.pinned && !existing.pinned) {
      await supabase.from('TtsAudio').update({ pinned: true }).eq('id', id)
      existing.pinned = true
    }
    return json({ audio: existing, cached: true })
  }

  const secret = await getKey()
  if (!secret) return json({ error: 'Kein OpenRouter-Key hinterlegt' }, 412)

  // Prefer mp3; some models only support one format and say so in a 400,
  // e.g. 'Gemini TTS only supports response_format="pcm". Got "mp3".'
  let format = 'mp3'
  let res = await requestSpeech(secret.value, model, voice, text, format)
  if (res.status === 400) {
    const errorText = await res.text()
    const supported = /only supports response_format=\W*(\w+)/.exec(errorText)
    if (!supported?.[1]) {
      return json({ error: `OpenRouter 400: ${errorText}` }, 502)
    }
    format = supported[1]
    res = await requestSpeech(secret.value, model, voice, text, format)
  }
  if (!res.ok) {
    return json({ error: `OpenRouter ${res.status}: ${await res.text()}` }, 502)
  }

  let contentType = res.headers.get('content-type') ?? 'audio/mpeg'
  let audio = new Uint8Array(await res.arrayBuffer())
  if (format === 'pcm') {
    audio = pcmToWav(audio, contentType)
    contentType = 'audio/wav'
  }
  const storagePath = `${id}.${extensionFor(contentType)}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, audio, { contentType, upsert: true })
  if (uploadError) throw uploadError

  const { data: row, error: insertError } = await supabase
    .from('TtsAudio')
    .upsert({
      id,
      text,
      model,
      voice,
      kind: body.kind ?? 'custom',
      order_number: body.orderNumber ?? null,
      storage_path: storagePath,
      content_type: contentType,
      bytes: audio.byteLength,
      chars: text.length,
      pinned: body.pinned ?? false,
    })
    .select()
    .single()
  if (insertError) throw insertError

  return json({ audio: row, cached: false })
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const token = (req.headers.get('Authorization') ?? '').replace('Bearer ', '')
  const {
    data: { user },
  } = await supabase.auth.getUser(token)
  if (!user) return json({ error: 'Nicht angemeldet' }, 401)

  try {
    const body = await req.json()
    switch (body.action) {
      case 'key-status': {
        const secret = await getKey()
        return json({
          hasKey: !!secret,
          hint: secret ? keyHint(secret.value) : null,
          updatedAt: secret?.updated_at ?? null,
        })
      }
      case 'set-key': {
        const role = user.user_metadata?.role as string | undefined
        if (!['admin', 'manager'].includes(role ?? '')) {
          return json(
            { error: 'Nur Admins/Manager dürfen den Key ändern' },
            403,
          )
        }
        const key = (body.key as string | undefined)
          ?.trim()
          .replace(/^Bearer\s+/i, '')
        if (!key) return json({ error: 'Key fehlt' }, 400)
        // OpenRouter answers anything else with a confusing
        // "Missing Authentication header".
        if (!/^sk-or-\S{40,}$/.test(key)) {
          return json(
            {
              error: `Das ist kein vollständiger OpenRouter-Key (${key.length} Zeichen, beginnt mit „${key.slice(0, 6)}“). Ein Key beginnt mit sk-or-v1- und ist ca. 73 Zeichen lang; OpenRouter zeigt ihn nur einmal beim Erstellen an.`,
            },
            400,
          )
        }
        const test = await testKey(key)
        if (!test.ok) return json({ error: test.error }, 400)
        const { error } = await supabase.from('AppSecrets').upsert({
          key: KEY_NAME,
          value: key,
          updated_at: new Date().toISOString(),
          updated_by: user.id,
        })
        if (error) throw error
        return json({ hint: keyHint(key), test })
      }
      case 'test-key': {
        const secret = await getKey()
        if (!secret)
          return json({ error: 'Kein OpenRouter-Key hinterlegt' }, 412)
        const test = await testKey(secret.value)
        return json(test, test.ok ? 200 : 400)
      }
      case 'generate':
        return await generate(body as GenerateBody)
      default:
        return json({ error: `Unbekannte Aktion: ${body.action}` }, 400)
    }
  } catch (error) {
    console.error(error)
    return json(
      { error: error instanceof Error ? error.message : String(error) },
      500,
    )
  }
})
