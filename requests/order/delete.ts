import { useOrderStore } from "@/stores/orderStore";

export async function deleteOrderRequest(orderId: string) {
  try {
    await useOrderStore.getState().deleteOrder(orderId);
    return { success: true, message: "Order berhasil dihapus" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat menghapus order",
    };
  }
}
