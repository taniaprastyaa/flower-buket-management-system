import { create } from "zustand";
import { createClient } from "@/utils/supabase/client";
import type { Order } from "@/types";
import type { OrderDetailInput, FullOrderWithDetails } from "@/types";

// Buat instance Supabase
const supabase = createClient();

// State & Actions untuk store
interface OrderState {
  orders: Order[];
  selectedOrder: FullOrderWithDetails | null;
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
}

// Store Zustand untuk orders
export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  selectedOrder: null,
  loading: false,
  loadingCrud: false, 

  // Fetch Orders dari Supabase
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

  // Fungsi Create Order
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
      throw new Error(error.message); // lempar error ke atas
    }
  
    set((state) => ({ orders: [data, ...state.orders] }));
  },

  getOrderDetailsById: async (orderId: string) => {
    set({ loading: true });

    const { data, error } = await supabase.rpc("get_order_details", {
      p_order_id: orderId,
    });

    set({ loading: false });

    if (error) {
      console.error("Error getting order detail:", error.message);
      throw new Error("Gagal mengambil detail order!");
    }

    set({ selectedOrder: data });
  },
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
      console.error("Gagal update order:", error.message);
      throw new Error("Gagal update order");
    }
  
    // Refresh selected order dari server setelah update
    await useOrderStore.getState().getOrderDetailsById(orderId);
  },  
}));