import { z } from "zod";
import { usePaymentStore } from "@/stores/paymentStore";
import type { UpdatePayment } from "@/types";

const updatePaymentSchema = z.object({
  id: z.string().uuid({ message: "ID pembayaran tidak valid" }),
  amount: z.number().min(1, { message: "Jumlah pembayaran harus lebih dari 0" }),
  description: z.string().max(255).nullable(),
  payment_method: z.enum(["cash", "transfer"], {
    message: "Metode pembayaran tidak valid",
  }),
});

export async function updatePaymentRequest(paymentData: UpdatePayment) {
  try {
    const cleanedData = {
      ...paymentData,
      description:
        paymentData.description?.trim() === "" ? null : paymentData.description,
    };

    const validatedData = updatePaymentSchema.parse(cleanedData);

    await usePaymentStore.getState().updatePayment(validatedData);

    return { success: true, message: "Pembayaran berhasil diperbarui" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return { success: false, message: errorMessage };
    }

    if (error instanceof Error) {
      return {
        success: false,
        message: `Supabase Error: ${error.message}`,
      };
    }

    return {
      success: false,
      message: "Terjadi kesalahan saat memperbarui pembayaran",
    };
  }
}