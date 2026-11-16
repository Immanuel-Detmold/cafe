-- Migration: OpenRouter text-to-speech with a cached audio library.
-- Audio is generated once by the `tts` edge function, stored in the private
-- `tts-audio` bucket and indexed in "TtsAudio"; the Pi5 server only downloads
-- and plays it (see docs/PI5_SERVER.md). Idempotent, safe to re-run.

-- 1. Server-only secrets (OpenRouter API key). RLS on with no policies and no
--    grants: only service_role (edge functions, Pi5 server) can read or write.
CREATE TABLE IF NOT EXISTS public."AppSecrets" (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL
);
ALTER TABLE public."AppSecrets" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public."AppSecrets" FROM anon, authenticated;

-- 2. Generated audio library. id = sha256(model \n voice \n text), so the same
--    sentence with the same voice is only ever generated once.
CREATE TABLE IF NOT EXISTS public."TtsAudio" (
  id text PRIMARY KEY,
  text text NOT NULL,
  model text NOT NULL,
  voice text NOT NULL,
  kind text NOT NULL DEFAULT 'custom' CHECK (kind IN ('pickup', 'sample', 'custom')),
  order_number integer CHECK (order_number BETWEEN 1 AND 99),
  storage_path text NOT NULL,
  content_type text NOT NULL DEFAULT 'audio/mpeg',
  bytes integer,
  chars integer NOT NULL,
  pinned boolean NOT NULL DEFAULT false,
  play_count integer NOT NULL DEFAULT 0,
  last_played_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "TtsAudio_model_voice_kind_idx" ON public."TtsAudio" (model, voice, kind);

ALTER TABLE public."TtsAudio" ENABLE ROW LEVEL SECURITY;
-- Inserts happen only in the edge function (service_role); staff can browse,
-- pin and delete.
DROP POLICY IF EXISTS "Authenticated read TtsAudio" ON public."TtsAudio";
CREATE POLICY "Authenticated read TtsAudio" ON public."TtsAudio"
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Authenticated update TtsAudio" ON public."TtsAudio";
CREATE POLICY "Authenticated update TtsAudio" ON public."TtsAudio"
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated delete TtsAudio" ON public."TtsAudio";
CREATE POLICY "Authenticated delete TtsAudio" ON public."TtsAudio"
  FOR DELETE TO authenticated USING (true);

-- 3. Private bucket for the audio files.
INSERT INTO storage.buckets (id, name, public)
VALUES ('tts-audio', 'tts-audio', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Authenticated read tts-audio" ON storage.objects;
CREATE POLICY "Authenticated read tts-audio" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'tts-audio');
DROP POLICY IF EXISTS "Authenticated delete tts-audio" ON storage.objects;
CREATE POLICY "Authenticated delete tts-audio" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'tts-audio');

-- 4. Active TTS model (OpenRouter model id). `voice` already exists; replace an
--    old OpenAI voice name with a voice of the new default model.
INSERT INTO "AppData" (key, value, description)
SELECT
  'tts_model',
  'microsoft/mai-voice-2.1-flash',
  'OpenRouter-Modell für die Sprachausgabe (Stimme steht in voice)'
WHERE NOT EXISTS (
  SELECT 1 FROM "AppData" WHERE key = 'tts_model'
);

UPDATE "AppData"
SET value = 'de-DE-Mia:MAI-Voice-2.1-Flash'
WHERE key = 'voice'
  AND value IN ('alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer');
