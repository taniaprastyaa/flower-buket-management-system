import { usePaymentStore } from "@/stores/paymentStore";

export async function deletePaymentRequest(paymentId: string) {
  try {
    await usePaymentStore.getState().deletePayment(paymentId);

    return { success: true, message: "Pembayaran berhasil dihapus" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }

    return { success: false, message: "Terjadi kesalahan saat menghapus pembayaran" };
  }
}