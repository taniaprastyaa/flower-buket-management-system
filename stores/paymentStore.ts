import { create } from "zustand";
import { createClient } from "@/utils/supabase/client";
import type { Payment, NewPayment, UpdatePayment} from "@/types";

const supabase = createClient();

interface paymentState {
    payments: Payment[];
    selectedPayment: Payment | null;
    loading: boolean;
    loadingCrud: boolean;
    fetchPayments: () => Promise<void>;
    createPayment: (newPayment: NewPayment) => Promise<void>;
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
        payment_proof,
        } = newPayment;

        const { data, error } = await supabase.rpc("create_payment", {
        p_order_id: order_id,
        p_amount: amount,
        p_payment_date: payment_date,
        p_description: description,
        p_payment_method: payment_method,
        p_payment_proof: payment_proof,
        });

        set({ loadingCrud: false });

        if (error) {
        throw new Error(error.message);
        }

        set((state) => ({
        payments: [data, ...state.payments],
        }));
    },

    // get payment detail

    // update payment

    // delete payment
}));