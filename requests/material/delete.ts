import { z } from "zod";
import { useMaterialStore } from "@/stores/materialStore";

const idSchema = z.string().uuid({ message: "ID material tidak valid" });

export async function deleteMaterialRequest(materialId: string) {
  const result = idSchema.safeParse(materialId);

  if (!result.success) {
    return { success: false, message: result.error.errors[0].message };
  }

  try {
    await useMaterialStore.getState().deleteMaterial(result.data);
    return { success: true, message: "Material deleted successfully" };
  } catch (error) {
    if (error instanceof Error && error.message === "MATERIAL_USED_IN_EXPENSES") {
      return {
        success: false,
        message: "Material cannot be deleted because it has already been used in production",
      };
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while deleting material",
    };
  }
}
