"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useExpenseStore } from "@/stores/expenseStore";
import { ActionModal } from "@/components/dashboard/dialogs/action-modal";
import { updateExpenseRequest } from "@/requests/expense/update";
import type { Expense } from "@/types";

interface UpdateExpenseModalProps {
  open: boolean;
  onClose: () => void;
  expense: Expense | null;
}

export default function UpdateExpenseModal({ open, onClose, expense,
}: UpdateExpenseModalProps) {
  const { loadingCrud } = useExpenseStore();

  const [form, setForm] = useState({
    id: "",
    quantity: 0,
    amount: 0,
  });

  useEffect(() => {
    if (expense) {
      setForm({
        id: expense.id,
        quantity: expense.quantity,
        amount: expense.amount,
      });
    }
  }, [expense]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async () => {
    const result = await updateExpenseRequest(form);

    if (result.success) {
      toast.success(result.message);
      onClose();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <ActionModal open={open} onClose={onClose} type="update" title="Update Expense" onSubmit={handleSubmit} loading={loadingCrud} >
      <div className="grid gap-4">
        <div>
          <Label className="block text-sm font-medium mb-2" htmlFor="quantity">Quantity</Label>
          <Input id="quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} />
        </div>
        <div>
          <Label className="block text-sm font-medium mb-2" htmlFor="amount">Amount</Label>
          <Input id="amount" name="amount" type="number" value={form.amount} onChange={handleChange} />
        </div>
      </div>
    </ActionModal>
  );
}