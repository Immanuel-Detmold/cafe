'use client'

import { PAYMENT_METHODS } from '@/data/data'
import { Expense } from '@/data/useExpense'
import { OrdersAndItems } from '@/data/useOrders'
import {
  getPaymentMethodDistribution,
  groupRevenueExpenseByBucket,
} from '@/generalHelperFunctions/statisticHelper'
import { ChevronsUpDown } from 'lucide-react'
import { useMemo } from 'react'
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
} from 'recharts'

import { Button } from '@/components/ui/button'
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

import { DateRange } from './DateRangeControls'

const revenueExpenseConfig: ChartConfig = {
  revenue: {
    label: 'Umsatz',
    color: 'hsl(var(--chart-2))',
  },
  expenses: {
    label: 'Ausgaben',
    color: 'hsl(var(--chart-1))',
  },
}

// Distinct colors for the payment method pie slices
const PIE_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-1))',
]

interface StatisticChartsProps {
  orders: OrdersAndItems
  expenses: Expense[]
  range: DateRange
}

const StatisticCharts = ({ orders, expenses, range }: StatisticChartsProps) => {
  const bucketData = useMemo(
    () => groupRevenueExpenseByBucket(orders, expenses, range),
    [orders, expenses, range],
  )

  const paymentData = useMemo(
    () => getPaymentMethodDistribution(orders, PAYMENT_METHODS),
    [orders],
  )

  const paymentConfig = useMemo<ChartConfig>(() => {
    const config: ChartConfig = {}
    paymentData.forEach((d, index) => {
      config[d.method] = {
        label: d.label,
        color: PIE_COLORS[index % PIE_COLORS.length],
      }
    })
    return config
  }, [paymentData])

  return (
    <Collapsible className="mt-4 w-full">
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          Diagramme anzeigen
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-2">
          {/* Revenue vs. expenses */}
          <Card>
            <CardHeader>
              <CardTitle>Umsatz & Ausgaben</CardTitle>
              <CardDescription>
                {range.from.toLocaleDateString('de-DE')} –{' '}
                {range.to.toLocaleDateString('de-DE')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={revenueExpenseConfig}>
                <LineChart
                  accessibilityLayer
                  data={bucketData}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="bucket"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    dataKey="revenue"
                    type="monotone"
                    stroke="var(--color-revenue)"
                    strokeWidth={2}
                    dot={true}
                  />
                  <Line
                    dataKey="expenses"
                    type="monotone"
                    stroke="var(--color-expenses)"
                    strokeWidth={2}
                    dot={true}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Payment method distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Zahlungsarten</CardTitle>
              <CardDescription>Verteilung im Zeitraum</CardDescription>
            </CardHeader>
            <CardContent>
              {paymentData.length > 0 ? (
                <ChartContainer
                  config={paymentConfig}
                  className="mx-auto aspect-square max-h-[300px]"
                >
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={paymentData}
                      dataKey="value"
                      nameKey="label"
                      label={({ value }: { value: number }) =>
                        value.toLocaleString('de-DE', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) + '€'
                      }
                      labelLine={true}
                    >
                      {paymentData.map((entry, index) => (
                        <Cell
                          key={entry.method}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <ChartLegend
                      content={<ChartLegendContent nameKey="label" />}
                    />
                  </PieChart>
                </ChartContainer>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Keine Daten für diesen Zeitraum.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default StatisticCharts
