import { TtsModel } from '@/data/useTts'

// OpenRouter's model list has no language metadata, so the grouping below is
// hand-picked (checked 2026-11-16). Unknown new models land in "other".

/** "de-DE-Mia:MAI-Voice-2.1-Flash" (Microsoft) or "aura-2-elara-de" (Deepgram) */
export const isGermanVoice = (voice: string) => /^de-|-de$/i.test(voice)

const RECOMMENDED: Record<string, string> = {
  'microsoft/mai-voice-2.1-flash':
    'Empfohlen: günstig, native deutsche Stimmen, guter Standard.',
  'elevenlabs/eleven-multilingual-v2':
    'Empfohlen für beste Qualität: sehr natürlich, ca. 5× teurer – lohnt sich für das Abholset, das nur einmal erzeugt wird.',
  'deepgram/aura-2':
    'Empfohlen: 7 native deutsche Stimmen, klar und gut verständlich.',
}

// Every voice of these models speaks German, even though voices have English names.
const MULTILINGUAL =
  /^(elevenlabs\/eleven-(multilingual-v2|v3|v4|turbo-v2\.5|flash-v2\.5)|google\/gemini-)/

type Category = 'recommended' | 'german' | 'multilingual' | 'other'

const categoryOf = (model: TtsModel): Category => {
  if (RECOMMENDED[model.id]) return 'recommended'
  if (model.voices.some(isGermanVoice)) return 'german'
  if (MULTILINGUAL.test(model.id)) return 'multilingual'
  return 'other'
}

const GROUP_LABELS: Record<Category, string> = {
  recommended: 'Empfohlen',
  german: 'Mit deutschen Stimmen',
  multilingual: 'Mehrsprachig (spricht Deutsch)',
  other: 'Eher nicht für Deutsch',
}

export const groupModels = (models: TtsModel[]) => {
  const recommendedOrder = Object.keys(RECOMMENDED)
  return (Object.keys(GROUP_LABELS) as Category[])
    .map((category) => ({
      label: GROUP_LABELS[category],
      models: models
        .filter((m) => categoryOf(m) === category)
        .sort((a, b) =>
          category === 'recommended'
            ? recommendedOrder.indexOf(a.id) - recommendedOrder.indexOf(b.id)
            : 0,
        ),
    }))
    .filter((group) => group.models.length > 0)
}

export const modelNote = (model: TtsModel) => {
  switch (categoryOf(model)) {
    case 'recommended':
      return RECOMMENDED[model.id]
    case 'german':
      return 'Hat native deutsche Stimmen.'
    case 'multilingual':
      return 'Stimmen haben englische Namen, sprechen aber Deutsch. Am besten anhören.'
    default:
      return 'Keine deutsche Stimme bekannt – klingt vermutlich nach Akzent.'
  }
}
