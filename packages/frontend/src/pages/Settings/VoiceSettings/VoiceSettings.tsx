import { getServerIp, useAppData } from '@/data/useAppData'
import {
  getTtsSettings,
  useTtsAudioQuery,
  useTtsModelsQuery,
} from '@/data/useTts'
import { useUser } from '@/data/useUser'
import { Loader2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'

import AudioLibraryCard from './AudioLibraryCard'
import OpenRouterKeyCard from './OpenRouterKeyCard'
import VoiceStudioCard from './VoiceStudioCard'

const VoiceSettings = () => {
  const { access_token } = useUser()
  const { data: appData } = useAppData()
  const { data: models, isLoading: isLoadingModels } = useTtsModelsQuery()
  const { data: audios } = useTtsAudioQuery()

  const active = getTtsSettings(appData)
  const serverIp = appData?.find((item) => item.key === 'server_ip')?.value
  const ip = serverIp ? getServerIp(serverIp) : ''

  // Studio selection, starts at the active voice once AppData is loaded
  const [model, setModel] = useState('')
  const [voice, setVoice] = useState('')
  useEffect(() => {
    if (appData && !model) {
      setModel(active.model)
      setVoice(active.voice)
    }
  }, [appData, model, active.model, active.voice])

  return (
    <div className="mt-2 flex flex-col items-center">
      <div className="flex w-full max-w-2xl flex-col gap-4">
        <OpenRouterKeyCard />
        {isLoadingModels || !models ? (
          <Loader2Icon className="mx-auto animate-spin" />
        ) : (
          <VoiceStudioCard
            models={models}
            model={model}
            voice={voice}
            setModel={setModel}
            setVoice={setVoice}
            active={active}
            audios={audios ?? []}
            ip={ip}
            accessToken={access_token ?? ''}
          />
        )}
        <AudioLibraryCard
          audios={audios ?? []}
          active={active}
          ip={ip}
          accessToken={access_token ?? ''}
        />
      </div>
    </div>
  )
}

export default VoiceSettings
