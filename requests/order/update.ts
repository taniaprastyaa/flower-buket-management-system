import { z } from "zod";
import { useOrderStore } from "@/stores/orderStore";
import { crudOrder } from "@/types";

const updateOrderSchema = z.object({
  order_id: z.string().uuid(),
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
        status: z.enum(["Pending", "In Progress", "Completed", "Canceled"]),
      })
    )
    .min(1, { message: "Minimal 1 order detail harus diinput" }),
});

export async function updateOrderRequest(orderData: crudOrder) {
    try {
      const validated = updateOrderSchema.parse(orderData);
  
      await useOrderStore.getState().updateOrder(
        validated.order_id,
        validated.customer_name,
        validated.contact,
        validated.notes ?? null,
        validated.order_details
      );
  
      return { success: true, message: "Order berhasil diperbarui" };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
        return { success: false, message };
      }
      return { success: false, message: "Terjadi kesalahan saat memperbarui order" };
    }
}
