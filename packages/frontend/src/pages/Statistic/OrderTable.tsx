import { OrdersAndItems } from '@/data/useOrders'
import { centsToEuro } from '@/generalHelperFunctions/currencyHelperFunction'

import {
  Table,
  TableBody, // TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { produceFormattedData } from './helperFunctions'

const OrderTable = ({ filteredData }: { filteredData: OrdersAndItems }) => {
  // const { productData, sum } = transformOrdersToProductGroups(filteredData)

  const formattedRows = produceFormattedData(filteredData)

  const sumEuro = centsToEuro(
    formattedRows.reduce((total, row) => total + row.sumCents, 0),
  )

  return (
    <Table className="mt-2">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Produkt</TableHead>

          <TableHead>Preise / Anzahl</TableHead>
          <TableHead>Summe</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {formattedRows.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="font-medium">{row.productName}</TableCell>
            {/* row.quantity already has combined pricing info, like "4,00 (x1), 3,50 (x2)" */}
            <TableCell>{row.quantity}</TableCell>
            {/* Convert each product’s total from cents into a euro string */}
            <TableCell>{centsToEuro(row.sumCents)}€</TableCell>
          </TableRow>
        ))}
      </TableBody>

      <TableFooter>
        <TableRow>
          {/* span the first two cells so the sum is in the third column */}
          <TableCell colSpan={2}>Summe</TableCell>
          <TableCell>{sumEuro}€</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

export default OrderTable
