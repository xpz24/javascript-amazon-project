export interface ProductOrdered {
  productId: string;
  quantity: number;
  estimatedDeliveryTime: string;
  variation: number | null;
}

export interface Order {
  id: string;
  orderTime: string;
  totalCostCents: number;
  products: ProductOrdered[];
}

export const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');

export function addOrder(order: Order): void{
  orders.unshift(order);
  saveToStorage();
}

function saveToStorage(): void {
  localStorage.setItem('orders', JSON.stringify(orders));
}
