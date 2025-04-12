"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useMaterialStore } from "@/stores/materialStore";
import { createMaterialRequest } from "@/requests/material/create";
import { ActionModal } from "@/components/dashboard/dialogs/action-modal";

interface CreateMaterialModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateMaterialModal({ open, onClose }: CreateMaterialModalProps) {
  const { loadingCrud } = useMaterialStore();

  const [form, setForm] = useState({
    name: "",
    unit: "",
    price: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    const result = await createMaterialRequest(form);

    if (result.success) {
      toast.success(result.message);
      onClose();
      setForm({ name: "", unit: "", price: 0 }); 
    } else {
      toast.error(result.message);
    }
  };

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      type="create"
      title="Tambah Material"
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