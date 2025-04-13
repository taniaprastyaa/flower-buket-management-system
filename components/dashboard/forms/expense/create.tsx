"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useExpenseStore } from "@/stores/expenseStore";
import { useMaterialStore } from "@/stores/materialStore";
import { createExpenseRequest } from "@/requests/expense/create";
import { ActionModal } from "@/components/dashboard/dialogs/action-modal";

interface CreateExpenseModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateExpenseModal({ open, onClose }: CreateExpenseModalProps) {
  const { loadingCrud } = useExpenseStore();
  const { materials, fetchMaterials } = useMaterialStore();

  const [form, setForm] = useState({
    material_id: "",
    quantity: 0,
    date: "",
    amount: 0,
  });

  useEffect(() => {
    if (open) fetchMaterials();
  }, [open, fetchMaterials]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "amount" ? Number(value) : value,
    }));
  };

  const handleSelectMaterial = (value: string) => {
    setForm((prev) => ({ ...prev, material_id: value }));
  };

  const handleSubmit = async () => {
    const result = await createExpenseRequest(form);

    if (result.success) {
      toast.success(result.message);
      onClose();
      setForm({ material_id: "", quantity: 0, date: "", amount: 0 });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      type="create"
      title="Tambah Pengeluaran"
      onSubmit={handleSubmit}
      loading={loadingCrud}
    >
      <div className="grid gap-4">
        <div>
          <Label className="block text-sm font-medium mb-2" htmlFor="material_id">Material</Label>
          <Select onValueChange={handleSelectMaterial} value={form.material_id}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Material" />
            </SelectTrigger>
            <SelectContent>
              {materials.map((material) => (
                <SelectItem key={material.id} value={material.id}>
                  {material.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block text-sm font-medium mb-2" htmlFor="quantity">Jumlah</Label>
          <Input id="quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} />
        </div>
        <div>
          <Label className="block text-sm font-medium mb-2" htmlFor="date">Tanggal</Label>
          <Input id="date" name="date" type="date" value={form.date} onChange={handleChange} />
        </div>
        <div>
          <Label className="block text-sm font-medium mb-2" htmlFor="amount">Nominal</Label>
          <Input id="amount" name="amount" type="number" value={form.amount} onChange={handleChange} />
        </div>
      </div>
    </ActionModal>
  );
}