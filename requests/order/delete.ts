import { useOrderStore } from "@/stores/orderStore";

export async function deleteOrderRequest(orderId: string) {
  try {
    await useOrderStore.getState().deleteOrder(orderId);
    return { success: true, message: "Order successfully deleted" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error
        ? error.message
        : "An error occurred while deleting the order",
    };
  }
}
