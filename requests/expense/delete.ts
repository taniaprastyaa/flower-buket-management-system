import { useExpenseStore } from "@/stores/expenseStore";

export async function deleteExpenseRequest(expenseId: string) {
  try {
    await useExpenseStore.getState().deleteExpense(expenseId);

    return { success: true, message: "Pengeluaran berhasil dihapus" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }

    return { success: false, message: "Terjadi kesalahan saat menghapus pengeluaran" };
  }
}
