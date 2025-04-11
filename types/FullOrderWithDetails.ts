import { OrderDetailSize } from "./OrderDetail";

export interface FullOrderWithDetails {
  order_code: string;
  order_status: "paid" | "unpaid" | "partial";
  customer_name: string;
  contact: string;
  notes: string | null;
  total_price: number;
  order_details: {
    buket_name: string;
    size: OrderDetailSize;
    price: number;
    quantity: number;
    details: string | null;
    deadline: string; // ISO date string
    status: "pending" | "in_progress" | "completed" | "canceled";
  }[];
}