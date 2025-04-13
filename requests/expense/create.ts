import { z } from "zod";
import { useExpenseStore } from "@/stores/expenseStore";
import type { NewExpense } from "@/types";

const createExpenseSchema = z.object({
  material_id: z.string().uuid({ message: "Material wajib dipilih" }),
  quantity: z
    .number({ invalid_type_error: "Jumlah harus berupa angka" })
    .min(1, { message: "Jumlah minimal 1" }),
  date: z.string().min(1, { message: "Tanggal wajib diisi" }),
  amount: z
    .number({ invalid_type_error: "Total biaya harus berupa angka" })
    .min(1, { message: "Biaya minimal 1" }),
});

export async function createExpenseRequest(expenseData: NewExpense) {
  try {
    const validatedData = createExpenseSchema.parse(expenseData);
    await useExpenseStore.getState().createExpense(validatedData);

    return { success: true, message: "Pengeluaran berhasil ditambahkan" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return { success: false, message: errorMessage };
    }

    if (error instanceof Error && error.message.includes("tidak ditemukan")) {
      return {
        success: false,
        message: "Material tidak ditemukan",
      };
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menambahkan pengeluaran",
    };
  }
}