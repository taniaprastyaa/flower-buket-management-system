"use client";

import { ActionModal } from "@/components/dashboard/dialogs/action-modal";
import { useOrderStore } from "@/stores/orderStore";
import { useState } from "react";
import { toast } from "sonner";
import { deleteOrderRequest } from "@/requests/order/delete";
import { DeleteConfirmationMessage } from "@/components/ui/delete-confirmation-message";

interface DeleteOrderDialogProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  orderCode: string;
}

export function DeleteOrderDialog({
  open,
  onClose,
  orderId,
  orderCode,
}: DeleteOrderDialogProps) {
  const { fetchOrders } = useOrderStore();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteOrderRequest(orderId);

    if (result.success) {
      await fetchOrders();
      toast.success(result.message);
      onClose();
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      type="delete"
      title={`Delete Order ${orderCode}?`}
      onSubmit={handleDelete}
      loading={loading}
    >
    <DeleteConfirmationMessage label={`order ${orderCode}`} />
    </ActionModal>
  );
}