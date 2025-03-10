import { Loader2 } from 'lucide-react'

interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
}

export function LoadingOverlay({
  isLoading,
  message = 'Loading...',
}: LoadingOverlayProps) {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background flex flex-col items-center gap-3 rounded-lg p-6 shadow-xl">
        <Loader2 className="h-8 w-8 animate-spin " />
        <p className="text-primary font-medium">{message}</p>
      </div>
    </div>
  )
}
