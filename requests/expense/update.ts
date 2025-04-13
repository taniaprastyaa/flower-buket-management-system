import { z } from "zod";
import { useExpenseStore } from "@/stores/expenseStore";
import type { UpdateExpense } from "@/types";

const updateExpenseSchema = z.object({
  id: z.string().uuid(),
  quantity: z.number().min(1, { message: "Jumlah tidak boleh kurang dari 1" }),
  amount: z.number().min(1, { message: "Total biaya tidak boleh kurang dari 1" }),
});

export async function updateExpenseRequest(expenseData: UpdateExpense) {
  try {
    const validatedData = updateExpenseSchema.parse(expenseData);
    await useExpenseStore.getState().updateExpense(validatedData);

    return { success: true, message: "Pengeluaran berhasil diperbarui" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return { success: false, message: errorMessage };
    }

    return { success: false, message: "Terjadi kesalahan saat memperbarui pengeluaran" };
  }
}
