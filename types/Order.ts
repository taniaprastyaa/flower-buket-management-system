export interface Order {
  id: string;
  order_code: string;
  payment_status: string;
  customer_name: string;
  contact: string;
  notes: string;
  total_price: number;
  order_details: {
    id: string;
    order_id: string;
    buket_name: string;
    size: string;
    price: number;
    quantity: number;
    details: string;
    deadline: string;
    status: string;
  }[];
}

export type NewOrder = Omit<Order, 'id' | 'order_code' | 'created_at' | 'updated_at' | 'payment_status'>;

export interface OrderDetailInput {
  id?: string;
  buket_name: string;
  size: string;
  price: number;
  quantity: number;
  details: string;
  deadline: string;
  status?: string;
}[];

export interface crudOrder{
  customer_name: string,
  contact: string,
  notes: string | null,
  order_details: {
    buket_name: string;
    size: string;
    price: number;
    quantity: number;
    details: string;
    deadline: string;
  }[];
}