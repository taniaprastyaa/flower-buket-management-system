import { z } from "zod";
import { usePaymentStore } from "@/stores/paymentStore";
import type { NewPayment } from "@/types";

const createPaymentSchema = z.object({
  order_id: z.string().uuid({ message: "Invalid order ID" }),
  amount: z.number().min(1, { message: "Payment amount must be greater than 0" }),
  payment_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid payment date",
  }),
  description: z.string().max(255).nullable(),
  payment_method: z.enum(["cash", "transfer"], {
    message: "Invalid payment method",
  }),
});

export async function createPaymentRequest(paymentData: NewPayment) {
  const cleanedData = {
    ...paymentData,
    description:
      paymentData.description?.trim() === "" ? null : paymentData.description?.trim(),
  };

  const result = createPaymentSchema.safeParse(cleanedData);

  if (!result.success) {
    const errorMessage = result.error.errors
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join(", ");
    return { success: false, message: errorMessage };
  }

  try {
    await usePaymentStore.getState().createPayment(result.data);
    return { success: true, message: "Payment has been successfully added" };
  } catch (error) {
    
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while adding the payment",
    };
  }
}
