import { z } from "zod";
import { usePaymentStore } from "@/stores/paymentStore";
import type { NewPayment } from "@/types";

const createPaymentSchema = z.object({
  order_id: z.string().uuid({ message: "Order ID tidak valid" }),
  amount: z.number().min(1, { message: "Jumlah pembayaran tidak boleh 0" }),
  payment_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Tanggal pembayaran tidak valid",
  }),
  description: z.string().max(255).nullable(),
  payment_method: z.enum(["cash", "transfer"], {
    message: "Metode pembayaran tidak valid",
  }),
});

export async function createPaymentRequest(paymentData: NewPayment) {
  try {
    const cleanedData = {
      ...paymentData,
      description:
        paymentData.description?.trim() === "" ? null : paymentData.description,
    };

    const validatedData = createPaymentSchema.parse(cleanedData);
    await usePaymentStore.getState().createPayment(validatedData);

    return { success: true, message: "Pembayaran berhasil ditambahkan" };
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
      message: "Terjadi kesalahan saat menambahkan pembayaran",
    };
  }
}