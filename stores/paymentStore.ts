import { create } from "zustand";
import type { Payment, NewPayment, UpdatePayment} from "@/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

interface paymentState {
    payments: Payment[];
    selectedPayment: Payment | null;
    loading: boolean;
    loadingCrud: boolean;
    fetchPayments: () => Promise<void>;
    createPayment: (newPayment: NewPayment) => Promise<void>;
    getPaymentById: (paymentId: string) => Promise<void>;
    updatePayment: (updatedPayment: UpdatePayment) => Promise<void>;
    deletePayment: (paymentId: string) => Promise<void>;
}

export const usePaymentStore = create<paymentState>((set) => ({
    payments: [],
    selectedPayment: null,
    loading: false,
    loadingCrud: false,

    // get all payments
    fetchPayments: async () => {
        set({ loading: true });
        
        const { data, error } = await supabase
        .from("payments_view")
        .select("*")
        .order("created_at", { ascending: false });
        
        set({ loading: false });
        
        if (error) {
            throw new Error("Gagal mengambil data payments!");
        }
        
        set({ payments: data });
    },  

    // create payment
    createPayment: async (newPayment) => {
        set({ loadingCrud: true });
    
        const {
        order_id,
        amount,
        payment_date,
        description,
        payment_method,
        } = newPayment;
    
        const { data, error } = await supabase.rpc("create_payment", {
        p_order_id: order_id,
        p_amount: amount,
        p_payment_date: payment_date,
        p_description: description,
        p_payment_method: payment_method,
        });
    
        set({ loadingCrud: false });

        if (error) {
            throw new Error(error.message);
        }

        const { data: fullPayment, error: viewError } = await supabase
        .from("payments_view")
        .select("*")
        .eq("id", data.id)
        .single();
    
        set({ loadingCrud: false });
    
        if (viewError) {
            throw new Error("Gagal mengambil data payment!");
        }
    
        set((state) => ({
            payments: [fullPayment, ...state.payments],
        }));
    },
  

    // get payment by id
    getPaymentById: async (paymentId: string) => {
        set({ loading: true });

        const { data, error } = await supabase
        .from("payments_view")
        .select("*")
        .eq("id", paymentId)
        .single();

        set({ loading: false });

        if (error) {
        throw new Error("Gagal mengambil detail payment!");
        }

        set({ selectedPayment: data });
    },

    // update payment
    updatePayment: async (updatedPayment) => {
        set({ loadingCrud: true });

        const { id, amount, description, payment_method } = updatedPayment;

        const { error } = await supabase.rpc("update_payment", {
        p_payment_id: id,
        p_amount: amount,
        p_description: description,
        p_payment_method: payment_method,
        });

        if (error) {
        set({ loadingCrud: false });
            throw new Error(error.message);
        }

        const { data: fullPayment, error: viewError } = await supabase
        .from("payments_view")
        .select("*")
        .eq("id", id)
        .single();

        set({ loadingCrud: false });

        if (viewError) {
            throw new Error("Gagal mengambil data payment!");
        }

        set((state) => ({
        payments: state.payments.map((payment) =>
            payment.id === id ? fullPayment : payment
        ),
        selectedPayment: fullPayment,
        }));
    },

    // delete payment
    deletePayment: async (paymentId: string) => {
        set({ loadingCrud: true });
    
        const { error } = await supabase.rpc("delete_payment", {
          p_payment_id: paymentId,
        });
    
        set({ loadingCrud: false });
    
        if (error) {
          throw new Error(error.message);
        }
    
        set((state) => ({
          payments: state.payments.filter((payment) => payment.id !== paymentId),
          selectedPayment:
            state.selectedPayment?.id === paymentId ? null : state.selectedPayment,
        }));
    },
}));