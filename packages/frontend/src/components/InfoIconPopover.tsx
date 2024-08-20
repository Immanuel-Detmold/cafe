import { InfoIcon } from 'lucide-react'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export default function InfoIconPopover({ text }: { text: string }) {
  const normalizedText = text.replace(/\\n/g, '\n')
  const splittedText = normalizedText.split('\n')
  return (
    <Popover>
      <PopoverTrigger>
        <InfoIcon className="ml-2 cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent className="flex flex-col space-y-2">
        {splittedText.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </PopoverContent>
    </Popover>
  )
}
