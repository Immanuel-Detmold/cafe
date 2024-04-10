import { Order, OrderItems } from '@/data/useOrders'
import { Product } from '@/data/useProducts'

export const formatDateToTime = (timestamp: string): string => {
  const date = new Date(timestamp)

  // Format the time to hh:mm format
  const time = date.toLocaleTimeString('de', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return time.toString()
}

export type OpenOrder = Order & {
  OrderItems: Array<OrderItems & { Products: Product }>
}

// export type OpenOrder = {
//   comment: string | null;
//   created_at: string;
//   customer_name: string | null;
//   id: number;
//   payment_method: string | null;
//   price: number;
//   status: 'waiting' | 'processing' | 'ready' | 'finished';
//   OrderItems: Array<{
//     comment: string | null;
//     created_at: string;
//     id: number;
//     order_id: number;
//     product_id: number;
//     product_name: string;
//     product_price: number;
//     quantity: number;
//     Products: {
//       category: string | null;
//       created_at: string;
//       deleted: boolean | null;
//       id: number;
//       image: string | null;
//       method: string | null;
//       name: string;
//       price: number;
//     };
//   }>;
// };

// export const getCategoriesAndProducts = (orderData: OpenOrder[]) => {

//   if(orderData){
//   // Extract unique product objects from orders
//   const currentProducts = [
//     ...new Set(
//       orderData.flatMap((order) =>
//         order?.OrderItems.map((item) => item.Products),
//       ),
//     ),
//   ]

//   // Extract unique category names from products
//   const currentCategories = [
//     ...new Set(currentProducts.map((product) => product?.category)),
//   ]
//   console.log(currentCategories, currentProducts)

//   return { currentCategories, currentProducts }
//   }
//   else{
//     return {currentCategories: [], currentProducts: []}
//   }
// }

export const getCategoriesAndProducts = (orderData: OpenOrder[]) => {
  if (orderData) {
    // Extract unique product objects from orders
    const currentProducts: Product[] = []
    orderData.forEach((order) =>
      order.OrderItems.forEach((item) => {
        if (
          !currentProducts.some((product) => product.id === item.Products.id)
        ) {
          currentProducts.push(item.Products)
        }
      }),
    )

    // Extract unique category names from products
    const currentCategoriesSet = new Set<string>()
    orderData.forEach((order) =>
      order?.OrderItems.forEach((item) => {
        currentCategoriesSet.add(item.Products.category)
      }),
    )
    const currentCategories = Array.from(currentCategoriesSet)

    return { currentCategories, currentProducts }
  } else {
    return { currentCategories: [], currentProducts: [] }
  }
}
