Document the code

Use Toasts like this. Write meaningful text
import { useToast } from '@/components/ui/use-toast'
const { toast } = useToast()
toast({
title: 'Erfolgreichtext...! ✅',
duration: 2000,
})

toast({
title: 'Fehlertext... ! ❌',
})
