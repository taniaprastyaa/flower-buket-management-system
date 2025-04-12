export interface Material {
    id: string;
    name: string;
    stock: number;      
    unit: string;
    price: number;
    created_at: string; 
    updated_at: string;
  }
  
  export type NewMaterial = Omit<Material, 'id' | 'created_at' | 'updated_at' | 'stock'>;
  
  export type UpdateMaterial = Partial<Omit<Material, 'id' | 'created_at'>> & { id: string };
  