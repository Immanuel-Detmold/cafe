'use client'

import { Expense } from '@/data/useExpense'
import { OrdersAndItems } from '@/data/useOrders'
import {
  combineData,
  groupPriceByMonth,
} from '@/generalHelperFunctions/statisticHelper'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

// const chartData2 =

const chartConfig: ChartConfig = {
  priceA: {
    label: 'Umsatz',
    color: 'hsl(var(--chart-2))',
  },
  priceB: {
    label: 'Ausgaben',
    color: 'hsl(var(--chart-1))',
  },
}

export function LineChartComponent({
  expensesYear,
  ordersYear,
}: {
  expensesYear: Expense[]
  ordersYear: OrdersAndItems
}) {
  const chartData = groupPriceByMonth(combineData(ordersYear, expensesYear))

  return (
    <Card className="mb-2 mt-2">
      <CardHeader>
        <CardTitle>Monatliche Ausgaben</CardTitle>
        <CardDescription>2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="priceA"
              type="monotone"
              stroke="var(--color-priceA)"
              strokeWidth={2}
              dot={true}
            />
            <Line
              dataKey="priceB"
              type="monotone"
              stroke="var(--color-priceB)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  )
}
