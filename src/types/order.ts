export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: number;
  tableNumber: string | null;
  customerName: string | null;
  total: number;
  status: OrderStatus;
  createdAt: string;
}