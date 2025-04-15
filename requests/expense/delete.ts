import { z } from "zod";
import { useExpenseStore } from "@/stores/expenseStore";

const idSchema = z.string().uuid({ message: "ID pengeluaran tidak valid" });

export async function deleteExpenseRequest(expenseId: string) {
  const result = idSchema.safeParse(expenseId);

  if (!result.success) {
    return { success: false, message: result.error.errors[0].message };
  }

  try {
    await useExpenseStore.getState().deleteExpense(result.data);
    return { success: true, message: "Expenses successfully deleted" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while deleting expenses",
    };
  }
}
