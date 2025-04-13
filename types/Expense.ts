export interface Expense {
    id: string;
    material_id: string;
    quantity: number;
    date: string;
    amount: number;
    created_at: string;
    updated_at: string;
}
  
export type NewExpense = Omit<Expense, 'id' | 'created_at' | 'updated_at'>;
  
export type UpdateExpense = Partial<Omit<Expense, 'id' | 'created_at'>> & { id: string };
  