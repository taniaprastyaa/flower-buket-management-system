import { z } from "zod";
import { usePaymentStore } from "@/stores/paymentStore";
import type { UpdatePayment } from "@/types";

const updatePaymentSchema = z.object({
  id: z.string().uuid({ message: "Invalid payment ID" }),
  amount: z.number().min(1, { message: "Payment amount must be greater than 0" }),
  description: z.string().max(255).nullable(),
  payment_method: z.enum(["cash", "transfer"], {
    message: "Invalid payment method",
  }),
});

export async function updatePaymentRequest(paymentData: UpdatePayment) {
  const cleanedData = {
    ...paymentData,
    description:
      paymentData.description?.trim() === "" ? null : paymentData.description?.trim(),
  };

  const result = updatePaymentSchema.safeParse(cleanedData);

  if (!result.success) {
    const errorMessage = result.error.errors
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join(", ");
    return { success: false, message: errorMessage };
  }

  try {
    await usePaymentStore.getState().updatePayment(result.data);
    return { success: true, message: "Payment has been successfully updated" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while updating the payment",
    };
  }
}
