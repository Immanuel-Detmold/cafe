import { useOrdersAndItemsQueryV2 } from '@/data/useOrders'
import {
  getEndOfDayToday,
  getStartOfDayToday,
} from '@/generalHelperFunctions/dateHelperFunctions'
import { ClockIcon, DiamondIcon } from 'lucide-react'

import { Label } from '@/components/ui/label'

const InProcessPage = () => {
  const startDate = getStartOfDayToday().finalDateString
  const endDate = getEndOfDayToday().endOfDayString

  const { data: openOrders } = useOrdersAndItemsQueryV2({
    statusList: ['processing', 'waiting'],
    startDate: startDate,
    endDate: endDate,
  })

  return (
    <>
      {openOrders && openOrders.length > 0 && (
        <div className="mt-2 flex w-full flex-col pt-2">
          {/* Heading */}
          <Label className="cinzel-decorative-regular mb-4 text-center text-3xl">
            <ClockIcon
              className="delay-90 inline-block animate-pulse stroke-[1px]"
              size={60}
            />
          </Label>

          {/* Numbers */}
          <div className="max-h-[770px] overflow-hidden">
            {openOrders &&
              openOrders.map((order, index) => (
                <div key={order.id} className="relative h-[96px]">
                  {/* Order Number & Diamond */}
                  <div
                    className={`absolute flex h-full w-full ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}
                  >
                    <div
                      className={`relative flex min-h-full w-1/2 items-center justify-center ${order.status === 'processing' ? 'text-amber-600' : ''}`}
                    >
                      <DiamondIcon
                        style={{ strokeWidth: '0.5px' }}
                        className={`absolute  ${order.status === 'processing' ? 'text-ember-600' : ''}`}
                        size={100}
                      />
                      <Label
                        className={`absolute z-50 self-center text-center text-2xl font-bold drop-shadow-lg ${order.status === 'processing' ? 'text-amber-600' : ''}`}
                      >
                        {order.order_number}
                      </Label>
                    </div>

                    <div className="min-h-full w-1/2"></div>
                  </div>
                  {/* Middle Lines and Icon */}
                  <div className="absolute flex w-full flex-col items-center justify-center">
                    <div className="bg-foreground mb-2 h-7 w-[2px]"></div>
                    <DiamondIcon className="mx-auto h-6 w-6" />
                    <div className="bg-foreground mt-2 h-7 w-[2px]"></div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  )
}

export default InProcessPage
