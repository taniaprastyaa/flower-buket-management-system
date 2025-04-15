import { create } from "zustand";
import type { Expense, NewExpense, UpdateExpense} from "@/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient()

interface expenseState {
    expenses: Expense[];
    selectedExpense: Expense | null;
    loading: boolean;
    loadingCrud: boolean;
    fetchExpenses: () => Promise<void>;
    createExpense: (newExpense: NewExpense) => Promise<void>;
    getExpenseById: (expenseId: string) => Promise<void>;
    updateExpense: (updatedExpense: UpdateExpense) => Promise<void>;
    deleteExpense: (expenseId: string) => Promise<void>;
}

export const useExpenseStore = create<expenseState>((set) => ({
  expenses: [],
  selectedExpense: null,
  loading: false,
  loadingCrud: false,

  // get all expenses
  fetchExpenses: async () => {
    set({ loading: true });
      
      const { data, error } = await supabase
      .from("expenses_view")
      .select("*")
      .order("created_at", { ascending: false });
      
      set({ loading: false });
        
      if (error) {
          throw new Error("Failed to retrieve expenses datas!");
      }
        
      set({ expenses: data });
  },  


  // create expense
  createExpense: async (newExpense) => {
    set({ loadingCrud: true });

    const { data, error } = await supabase
      .rpc("create_expense", {
        p_material_id: newExpense.material_id,
        p_quantity: newExpense.quantity,
        p_date: newExpense.date,
        p_amount: newExpense.amount,
      });

    set({ loadingCrud: false });

    if (error) {
      throw new Error(error.message);
    }

    const { data: fullExpense} = await supabase
    .from("expenses_view")
    .select("*")
    .eq("id", data.id)
    .single();

    set({ loadingCrud: false });

    set((state) => ({
      expenses: [fullExpense, ...state.expenses],
    }));
  },

  // get expense by id
  getExpenseById: async (expenseId: string) => {
    set({ loading: true });

    const { data, error } = await supabase
      .from("expenses_view")
      .select("*")
      .eq("id", expenseId)
      .single();

    set({ loading: false });

    if (error) {
      throw new Error("Failed to take expense details!");
    }

    set({ selectedExpense: data });
  },

  // update expense
  updateExpense: async (updatedExpense) => {
    set({ loadingCrud: true });

    const { id, quantity, amount } = updatedExpense;

    const { error } = await supabase.rpc("update_expense", {
      p_expense_id: id,
      p_quantity: quantity,
      p_amount: amount,
    });

    if (error) {
      set({ loadingCrud: false });
      throw new Error(error.message);
    }

    const { data: fullExpense, error: viewError } = await supabase
      .from("expenses_view")
      .select("*")
      .eq("id", id)
      .single();

    set({ loadingCrud: false });

    if (viewError) {
      throw new Error("Failed to retrieve expense data!");
    }

    set((state) => ({
      expenses: state.expenses.map((expense) =>
        expense.id === id ? fullExpense : expense
      ),
      selectedExpense: fullExpense,
    }));
  },

  // delete expense
  deleteExpense: async (expenseId: string) => {
    set({ loadingCrud: true });

    const { error } = await supabase.rpc("delete_expense", {
      p_expense_id: expenseId,
    });

    set({ loadingCrud: false });

    if (error) {
      throw new Error(error.message);
    }

    set((state) => ({
      expenses: state.expenses.filter((expense) => expense.id !== expenseId),
      selectedExpense:
        state.selectedExpense?.id === expenseId ? null : state.selectedExpense,
    }));
  },

}));