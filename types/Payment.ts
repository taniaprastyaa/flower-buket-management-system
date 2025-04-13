export type PaymentMethod = 'cash' | 'transfer';

export interface Payment {
    id: string;
    order_id: string;
    amount: number;
    description: string | null;
    payment_method: PaymentMethod;
    payment_proof: string | null;
    payment_date: string;
    created_at: string;
    updated_at: string;
}
  
export type NewPayment = Omit<Payment, 'id' | 'created_at' | 'updated_at'>;
  
export type UpdatePayment = Partial<Omit<Payment, 'id' | 'created_at'>> & { id: string };
  