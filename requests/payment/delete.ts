import { z } from "zod";
import { usePaymentStore } from "@/stores/paymentStore";

const idSchema = z.string().uuid({ message: "ID pembayaran tidak valid" });

export async function deletePaymentRequest(paymentId: string) {
  const result = idSchema.safeParse(paymentId);

  if (!result.success) {
    return { success: false, message: result.error.errors[0].message };
  }

  try {
    await usePaymentStore.getState().deletePayment(result.data);
    return { success: true, message: "Payment successfully cleared" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while deleting the payment",
    };
  }
}
