import { z } from "zod";
import { useExpenseStore } from "@/stores/expenseStore";
import type { NewExpense } from "@/types";

const createExpenseSchema = z.object({
  material_id: z.string().uuid({ message: "Material must be selected" }),
  quantity: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .min(1, { message: "Minimum quantity is 1" }),
  date: z.string().min(1, { message: "Date is required" }),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .min(1, { message: "Minimum amount is 1" }),
});

export async function createExpenseRequest(expenseData: NewExpense) {
  const result = createExpenseSchema.safeParse(expenseData);

  if (!result.success) {
    const errorMessage = result.error.errors
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join(", ");
    return { success: false, message: errorMessage };
  }

  try {
    await useExpenseStore.getState().createExpense(result.data);
    return { success: true, message: "Expense has been successfully added" };
  } catch (error) {
    if (error instanceof Error && error.message.includes("tidak ditemukan")) {
      return {
        success: false,
        message: "Material not found",
      };
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while adding the expense",
    };
  }
}