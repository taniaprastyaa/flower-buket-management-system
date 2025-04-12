import { z } from "zod";
import { useMaterialStore } from "@/stores/materialStore";
import type { NewMaterial } from "@/types";

const createMaterialSchema = z.object({
  name: z.string().min(2, { message: "Nama material minimal 2 karakter" }).nonempty(),
  unit: z.string().min(1, { message: "Satuan wajib diisi" }),
  price: z.number().min(1, { message: "Harga tidak boleh 0" }),
});

export async function createMaterialRequest(materialData: NewMaterial) {
  try {
    const validatedData = createMaterialSchema.parse(materialData);
    await useMaterialStore.getState().createMaterial(validatedData);

    return { success: true, message: "Material berhasil ditambahkan" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return { success: false, message: errorMessage };
    }

    if (error instanceof Error && error.message.includes("duplicate key")) {
      return {
        success: false,
        message: "Nama material sudah digunakan, gunakan nama lain",
      };
    }

    return { success: false, message: "Terjadi kesalahan saat menambahkan material" };
  }
}
