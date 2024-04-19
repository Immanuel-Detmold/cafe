import { OrdersAndItems } from '@/data/useOrders'
import { centsToEuro } from '@/generalHelperFunctions.tsx/currencyHelperFunction'

import {
  Table,
  TableBody, // TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { transformOrdersToProductGroups } from './helperFunctions'

const OrderTable = ({ filteredData }: { filteredData: OrdersAndItems }) => {
  const { productData, sum } = transformOrdersToProductGroups(filteredData)

  return (
    <Table className="mt-2">
      {/* <TableHeader>Produkte für diesen Tag</TableHeader> */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Produkt</TableHead>
          <TableHead>Preis</TableHead>
          <TableHead>Anzahl</TableHead>
          <TableHead className="">Summe</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {productData.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{centsToEuro(product.price)}</TableCell>
            <TableCell>{product.quantity}</TableCell>
            <TableCell className="">{centsToEuro(product.sum)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Summe</TableCell>
          <TableCell className="">{centsToEuro(sum)}€</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

export default OrderTable
