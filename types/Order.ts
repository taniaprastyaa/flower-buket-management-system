export type PaymentStatus = 'paid' | 'unpaid' | 'partial';

export interface Order {
  id: string;
  order_code: string;
  customer_name: string;
  contact: string;
  notes: string | null;
  total_price: number;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export type NewOrder = Omit<Order, 'id' | 'order_code' | 'created_at' | 'updated_at' | 'payment_status'>;
