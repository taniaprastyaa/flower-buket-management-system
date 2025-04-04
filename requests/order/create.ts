import { z } from "zod";
import { useOrderStore } from "@/stores/orderStore";

const createOrderSchema = z.object({
  customer_name: z.string().min(3, { message: "Nama customer minimal 3 karakter" }).nonempty(),
  contact: z.string().min(7, { message: "Kontak minimal 7 karakter" }).nonempty(),
  notes: z.string().optional(),
  order_details: z
    .array(
      z.object({
        buket_name: z.string().nonempty({ message: "Nama buket wajib diisi" }),
        size: z.enum(["s", "m", "l", "xl"]),
        price: z.number().min(1, { message: "Harga tidak boleh 0" }),
        quantity: z.number().min(1, { message: "Jumlah tidak boleh 0" }),
        details: z.string().nonempty({ message: "Detail wajib diisi" }),
        deadline: z.string().nonempty({ message: "Deadline wajib diisi" }),
      })
    )
    .min(1, { message: "Minimal 1 order detail harus diinput" }),
});

export async function createOrderRequest(orderData: any) {
  try {
    const validatedData = createOrderSchema.parse(orderData);

    await useOrderStore.getState().createOrder(
      validatedData.customer_name,
      validatedData.contact,
      validatedData.notes ?? null,
      validatedData.order_details
    );

    return { success: true, message: "Order berhasil dibuat" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ");
      return { success: false, message: errorMessage };
    }
    return { success: false, message: "Terjadi kesalahan saat membuat order" };
  }
}
