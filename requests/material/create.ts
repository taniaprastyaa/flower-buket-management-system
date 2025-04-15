import { z } from "zod";
import { useMaterialStore } from "@/stores/materialStore";
import type { NewMaterial } from "@/types";

const createMaterialSchema = z.object({
  name: z.string().min(2, { message: "Material name must be at least 2 characters" }).trim(),
  unit: z.string().min(1, { message: "Unit is required" }).trim(),
  price: z.number().min(1, { message: "Price must be greater than 0" }),
});

export async function createMaterialRequest(materialData: NewMaterial) {
  const result = createMaterialSchema.safeParse(materialData);

  if (!result.success) {
    const errorMessage = result.error.errors
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join(", ");
    return { success: false, message: errorMessage };
  }

  try {
    await useMaterialStore.getState().createMaterial(result.data);
    return { success: true, message: "Material has been successfully added" };
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return {
        success: false,
        message: "Material name is already in use, please choose another",
      };
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while adding the material",
    };
  }
}
