import { z } from "zod";
import { useExpenseStore } from "@/stores/expenseStore";
import type { UpdateExpense } from "@/types";

const updateExpenseSchema = z.object({
  id: z.string().uuid({ message: "Invalid expense ID" }),
  quantity: z.number().min(1, { message: "Minimum quantity is 1" }),
  amount: z.number().min(1, { message: "Minimum amount is 1" }),
});

export async function updateExpenseRequest(expenseData: UpdateExpense) {
  const result = updateExpenseSchema.safeParse(expenseData);

  if (!result.success) {
    const errorMessage = result.error.errors
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join(", ");
    return { success: false, message: errorMessage };
  }

  try {
    await useExpenseStore.getState().updateExpense(result.data);
    return { success: true, message: "Expense has been successfully updated" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while updating the expense",
    };
  }
}