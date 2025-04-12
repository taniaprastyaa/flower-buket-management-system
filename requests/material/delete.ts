import { useMaterialStore } from "@/stores/materialStore";

export async function deleteMaterialRequest(materialId: string) {
  try {
    await useMaterialStore.getState().deleteMaterial(materialId);

    return { success: true, message: "Material berhasil dihapus" };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "MATERIAL_USED_IN_EXPENSES") {
        return {
          success: false,
          message: "Material tidak bisa dihapus karena sudah dipakai di pengeluaran",
        };
      }

      return { success: false, message: error.message };
    }

    return { success: false, message: "Terjadi kesalahan saat menghapus material" };
  }
}
