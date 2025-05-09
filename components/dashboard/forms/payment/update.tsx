"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { usePaymentStore } from "@/stores/paymentStore";
import { ActionModal } from "@/components/dashboard/dialogs/action-modal";
import type { Payment, PaymentMethod } from "@/types";
import { updatePaymentRequest } from "@/requests/payment/update";

interface UpdatePaymentModalProps {
  open: boolean;
  onClose: () => void;
  payment: Payment | null;
}

export default function UpdatePaymentModal({ open, onClose, payment }: UpdatePaymentModalProps) {
  const { loadingCrud} = usePaymentStore();

  const [form, setForm] = useState({
    id: "",
    amount: 0,
    description: "",
    payment_method: "cash" as PaymentMethod,
  });

  useEffect(() => {
    if (payment) {
      setForm({
        id: payment.id,
        amount: payment.amount,
        description: payment.description ?? "",
        payment_method: payment.payment_method,
      });
    }
  }, [payment]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    const result = await updatePaymentRequest(form);

    if (result.success) {
      toast.success(result.message);
      onClose();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <ActionModal open={open} onClose={onClose} type="update" title="Update Payment" onSubmit={handleSubmit} loading={loadingCrud} >
      <div className="grid gap-4">
        <div>
          <Label className="block text-sm font-medium mb-2" htmlFor="amount">Amount</Label>
          <Input id="amount" name="amount" type="number" value={form.amount} onChange={handleChange} />
        </div>
        <div>
          <Label className="block text-sm font-medium mb-2" htmlFor="description">Description</Label>
          <Input id="description" name="description" type="text" value={form.description} onChange={handleChange} />
        </div>
        <div>
          <Label className="block text-sm font-medium mb-2" htmlFor="payment_method">Payment Method</Label>
          <Select
            onValueChange={(value: PaymentMethod) =>
              setForm((prev) => ({ ...prev, payment_method: value }))
            }
            value={form.payment_method}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Payment Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </ActionModal>
  );
}