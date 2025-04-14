"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { usePaymentStore } from "@/stores/paymentStore";
import { useOrderStore } from "@/stores/orderStore";
import { createPaymentRequest } from "@/requests/payment/create";
import { ActionModal } from "@/components/dashboard/dialogs/action-modal";
import type { PaymentMethod } from "@/types";

interface CreatePaymentModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreatePaymentModal({ open, onClose }: CreatePaymentModalProps) {
  const { loadingCrud } = usePaymentStore();
  const { orders, fetchOrders } = useOrderStore(); 

  const [form, setForm] = useState({
    order_id: "",
    amount: 0,
    payment_date: "",
    description: "",
    payment_method: "cash" as PaymentMethod,
  });

  useEffect(() => {
    if (open) fetchOrders();
  }, [open, fetchOrders]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSelectOrder = (value: string) => {
    setForm((prev) => ({ ...prev, order_id: value }));
  };

  const handleSubmit = async () => {
    const result = await createPaymentRequest(form);

    if (result.success) {
      toast.success(result.message);
      onClose();
      setForm({
        order_id: "",
        amount: 0,
        payment_date: "",
        description: "",
        payment_method: "cash", 
      });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      type="create"
      title="Tambah Pembayaran"
      onSubmit={handleSubmit}
      loading={loadingCrud}
    >
      <div className="grid gap-4">
        <div>
          <Label className="block text-sm font-medium mb-2" htmlFor="order_id">Order</Label>
          <Select onValueChange={handleSelectOrder} value={form.order_id}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Order" />
            </SelectTrigger>
            <SelectContent>
              {orders.map((order) => (
                <SelectItem key={order.id} value={order.id}>
                  {order.order_code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block text-sm font-medium mb-2" htmlFor="amount">Nominal</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label className="block text-sm font-medium mb-2" htmlFor="payment_date">Tanggal Pembayaran</Label>
          <Input
            id="payment_date"
            name="payment_date"
            type="date"
            value={form.payment_date}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label className="block text-sm font-medium mb-2" htmlFor="description">Deskripsi</Label>
          <Input
            id="description"
            name="description"
            type="text"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label className="block text-sm font-medium mb-2" htmlFor="payment_method">Metode Pembayaran</Label>
          <Select onValueChange={(value: PaymentMethod) => setForm((prev) => ({ ...prev, payment_method: value }))} value={form.payment_method}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Metode Pembayaran" />
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