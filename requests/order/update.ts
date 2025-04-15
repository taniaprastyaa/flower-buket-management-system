import { z } from "zod";
import { useOrderStore } from "@/stores/orderStore";
import { crudOrder } from "@/types";

const updateOrderSchema = z.object({
  order_id: z.string().uuid({ message: "Invalid order ID" }),
  customer_name: z.string().min(3, { message: "Customer name must be at least 3 characters" }).nonempty(),
  contact: z.string().min(7, { message: "Contact must be at least 7 characters" }).nonempty(),
  notes: z.string().optional(),
  order_details: z
    .array(
      z.object({
        buket_name: z.string().nonempty({ message: "Bouquet name is required" }),
        size: z.enum(["s", "m", "l", "xl"]),
        price: z.number().min(1, { message: "Price must be greater than 0" }),
        quantity: z.number().min(1, { message: "Quantity must be greater than 0" }),
        details: z.string().nonempty({ message: "Details are required" }),
        deadline: z.string().nonempty({ message: "Deadline is required" }),
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
  
      return { success: true, message: "Order has been successfully updated" };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
        return { success: false, message };
      }
      return { success: false, message: "An error occurred while updating the order" };
    }
}
