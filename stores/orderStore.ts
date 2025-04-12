import { create } from "zustand";
import { createClient } from "@/utils/supabase/client";
import type { Order, OrderDetailInput} from "@/types";

const supabase = createClient();

interface OrderState {
  orders: Order[];
  selectedOrder: Order;
  loading: boolean;
  loadingCrud: boolean;
  fetchOrders: () => Promise<void>;
  createOrder: (
    customer_name: string,
    contact: string,
    notes: string | null,
    orderDetails: OrderDetailInput[]
  ) => Promise<void>;
  getOrderDetailsById: (orderId: string) => Promise<void>;
  updateOrder: (
    orderId: string,
    customer_name: string,
    contact: string,
    notes: string | null,
    orderDetails: OrderDetailInput[]
  ) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  selectedOrder: {
    id: '',
    order_code: '',
    payment_status: '',
    customer_name: '',
    contact: '',
    notes: '',
    total_price: 0,
    order_details: [
      {
        id: '',
        order_id: '',
        buket_name: '',
        size: '',
        price: 0,
        quantity: 1,
        details: '',
        deadline: '',
        status: '',
      }
    ]
  },
  loading: false,
  loadingCrud: false, 

  // get all orders
  fetchOrders: async () => {
    set({ loading: true });
  
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
  
    set({ loading: false });
  
    if (error) {
      throw new Error("Gagal mengambil data orders!");
    }
  
    set({ orders: data });
  },  

  // create order
  createOrder: async (customer_name, contact, notes, orderDetails) => {
    set({ loadingCrud: true });
  
    const orderData = {
      p_customer_name: customer_name,
      p_contact: contact,
      p_notes: notes,
      p_order_details: orderDetails,
    };
  
    const { data, error } = await supabase.rpc("create_order", orderData);
  
    set({ loadingCrud: false });
  
    if (error) {
      throw new Error(error.message);
    }
  
    set((state) => ({ orders: [data, ...state.orders] }));
  },

  // get order and order detail by id
  getOrderDetailsById: async (orderId: string) => {
    set({ loading: true });

    const { data, error } = await supabase.rpc("get_order_details", {
      p_order_id: orderId,
    });

    set({ loading: false });

    if (error) {
      throw new Error("Gagal mengambil detail orders!");
    }

    set({ selectedOrder: data });
  },
  
  // update order add order detail
  updateOrder: async (orderId, customer_name, contact, notes, orderDetails) => {
    set({ loadingCrud: true });
  
    const updatePayload = {
      p_order_id: orderId,
      p_customer_name: customer_name,
      p_contact: contact,
      p_notes: notes,
      p_order_details: orderDetails,
    };
  
    const { error } = await supabase.rpc("update_order_with_details", updatePayload);
  
    set({ loadingCrud: false });
  
    if (error) {
      throw new Error(error.message);
    }
  
    await useOrderStore.getState().getOrderDetailsById(orderId);
  },  

  // delete order
  deleteOrder: async (orderId) => {
    set({ loadingCrud: true });

    const { error } = await supabase.rpc("delete_order", {
      p_order_id: orderId,
    });

    set({ loadingCrud: false });

    if (error) {
      throw new Error(error.message);
    }

    set((state) => ({
      orders: state.orders.filter((order) => order.id !== orderId),
    }));
  },
}));