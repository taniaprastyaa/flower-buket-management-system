import { create } from "zustand";
import type { Material, NewMaterial, UpdateMaterial} from "@/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

interface materialState {
    materials: Material[];
    selectedMaterial: Material | null;
    loading: boolean;
    loadingCrud: boolean;
    fetchMaterials: () => Promise<void>;
    createMaterial: (newMaterial: NewMaterial) => Promise<void>;
    getMaterialById: (materialId: string) => Promise<void>;
    updateMaterial: (updatedMaterial: UpdateMaterial) => Promise<void>;
    deleteMaterial: (materialId: string) => Promise<void>;
}

export const useMaterialStore = create<materialState>((set) => ({
    materials: [],
    selectedMaterial: null,
    loading: false,
    loadingCrud: false,

  // get all materials
  fetchMaterials: async () => {
    set({ loading: true });
      
    const { data, error } = await supabase
      .from("materials")
      .select("*")
      .order("created_at", { ascending: false });
      
      set({ loading: false });
      
      if (error) {
        throw new Error("Failed to retrieve materials data!");
      }
      
      set({ materials: data });
  },  

  // create material
  createMaterial: async (newMaterial) => {
    set({ loadingCrud: true });

    const { data, error } = await supabase
      .from("materials")
      .insert(newMaterial)
      .select()
      .single(); 

    set({ loadingCrud: false });

    if (error) {
      throw new Error(error.message);
    }

    set((state) => ({
      materials: [data, ...state.materials],
    }));
  },

  // get material by id
  getMaterialById: async (materialId: string) => {
    set({ loading: true });

    const { data, error } = await supabase
      .from("materials")
      .select("*")
      .eq("id", materialId)
      .single(); 

    set({ loading: false });

    if (error) {
      throw new Error(error.message);
    }

    set({ selectedMaterial: data });
  },

  // update material
  updateMaterial: async (updatedMaterial) => {
    set({ loadingCrud: true });
  
    const { id, ...fieldsToUpdate } = updatedMaterial;
  
    const { data, error } = await supabase
      .from("materials")
      .update(fieldsToUpdate)
      .eq("id", id)
      .select()
      .single();
  
    set({ loadingCrud: false });
  
    if (error) {
      throw new Error(error.message);
    }
  
    set((state) => ({
      materials: state.materials.map((material) =>
        material.id === id ? data : material
      ),
      selectedMaterial: data,
    }));
  },

  // delete material
  deleteMaterial: async (materialId) => {
    set({ loadingCrud: true });

    // Cek apakah material terpakai di tabel expenses
    const { count, error: countError } = await supabase
      .from("expenses")
      .select("id", { count: "exact", head: true })
      .eq("material_id", materialId);

    if (countError) {
      set({ loadingCrud: false });
      throw new Error(countError.message);
    }

    if (count && count > 0) {
      set({ loadingCrud: false });
      throw new Error("MATERIAL_USED_IN_EXPENSES");
    }

    const { error } = await supabase
      .from("materials")
      .delete()
      .eq("id", materialId);

    set({ loadingCrud: false });

    if (error) {
      if (
        error.message.includes("violates foreign key constraint") &&
        error.message.includes("expenses_material_id_fkey")
      ) {
        throw new Error("MATERIAL_USED_IN_EXPENSES");
      }

      throw new Error(error.message);
    }

    set((state) => ({
      materials: state.materials.filter((material) => material.id !== materialId),
      selectedMaterial:
        state.selectedMaterial?.id === materialId ? null : state.selectedMaterial,
    }));
  }

}));