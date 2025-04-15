import { z } from "zod";
import { useOrderStore } from "@/stores/orderStore";
import { crudOrder } from "@/types";

const createOrderSchema = z.object({
  customer_name: z.string().min(3, { message: "Customer name must be at least 3 characters" }).nonempty(),
  contact: z.string().min(7, { message: "Contact must be at least 7 characters" }).nonempty(),
  notes: z.string().optional(),
  order_details: z
    .array(
      z.object({
        buket_name: z.string().nonempty({ message: "Bouquet name is required" }),
        size: z.string().nonempty({ message: "Size is required" }),
        price: z.number().min(1, { message: "Price must be greater than 0" }),
        quantity: z.number().min(1, { message: "Quantity must be greater than 0" }),
        details: z.string().nonempty({ message: "Details are required" }),
        deadline: z.string().nonempty({ message: "Deadline is required" }),
      })
    )
    .min(1, { message: "At least one order detail must be provided" }),
});

export async function createOrderRequest(orderData: crudOrder) {
  try {
    const validatedData = createOrderSchema.parse(orderData);

    await useOrderStore.getState().createOrder(
      validatedData.customer_name,
      validatedData.contact,
      validatedData.notes ?? null,
      validatedData.order_details
    );

    return { success: true, message: "Order has been successfully created" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ");
      return { success: false, message: errorMessage };
    }
    return { success: false, message: "An error occurred while creating the order" };
  }
}
