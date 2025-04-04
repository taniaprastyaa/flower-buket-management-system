export type OrderDetailStatus = 'pending' | 'in_progress' | 'completed' | 'canceled';
export type OrderDetailSize = 's' | 'm' | 'l' | 'xl';

export interface OrderDetail {
  id: string;
  order_id: string;
  buket_name: string;
  size: OrderDetailSize;
  price: number;
  quantity: number;
  details: string | null;
  deadline: string;
  status: OrderDetailStatus;
  created_at: string;
  updated_at: string;
}

export type OrderDetailInput = {
  buket_name: string;
  size: OrderDetailSize;
  price: number;
  quantity: number;
  details: string | null;
  deadline: string;
};


export type NewOrderDetail = Omit<OrderDetail, 'id' | 'created_at' | 'updated_at'>;
