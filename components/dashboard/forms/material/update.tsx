"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useMaterialStore } from "@/stores/materialStore";
import { updateMaterialRequest } from "@/requests/material/update";
import { ActionModal } from "@/components/dashboard/dialogs/action-modal";
import type { Material } from "@/types";

interface UpdateMaterialModalProps {
  open: boolean;
  onClose: () => void;
  material: Material | null;
}

export default function UpdateMaterialModal({
  open,
  onClose,
  material,
}: UpdateMaterialModalProps) {
  const { loadingCrud } = useMaterialStore();

  const [form, setForm] = useState({
    id: "",
    name: "",
    unit: "",
    price: 0,
    stock: 0,
  });

  useEffect(() => {
    if (material) {
      setForm({
        id: material.id,
        name: material.name,
        unit: material.unit,
        price: material.price,
        stock: material.stock,
      });
    }
  }, [material]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    const result = await updateMaterialRequest(form);

    if (result.success) {
      toast.success(result.message);
      onClose();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      type="update"
      title="Update Material"
      onSubmit={handleSubmit}
      loading={loadingCrud}
    >
      <div className="grid gap-4">
        <div>
          <Label className="block text-sm font-medium mb-2" htmlFor="name">Nama</Label>
          <Input id="name" name="name" value={form.name} onChange={handleChange} />
        </div>
        <div>
          <Label className="block text-sm font-medium mb-2" htmlFor="unit">Satuan</Label>
          <Input id="unit" name="unit" value={form.unit} onChange={handleChange} />
        </div>
        <div>
          <Label className="block text-sm font-medium mb-2" htmlFor="price">Harga</Label>
          <Input id="price" name="price" type="number" value={form.price} onChange={handleChange} />
        </div>
      </div>
    </ActionModal>
  );
}