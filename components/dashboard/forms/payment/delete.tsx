import { ActionModal } from "@/components/dashboard/dialogs/action-modal";
import { usePaymentStore } from "@/stores/paymentStore";
import { useState } from "react";
import { toast } from "sonner";
import { deletePaymentRequest } from "@/requests/payment/delete";
import { DeleteConfirmationMessage } from "@/components/ui/delete-confirmation-message";

interface DeletePaymentDialogProps {
  open: boolean;
  onClose: () => void;
  paymentId: string;
}

export function DeletePaymentDialog({
  open,
  onClose,
  paymentId,
}: DeletePaymentDialogProps) {
  const { fetchPayments } = usePaymentStore();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await deletePaymentRequest(paymentId);

    if (result.success) {
      await fetchPayments();
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
      title={`Hapus Pembayaran?`}
      onSubmit={handleDelete}
      loading={loading}
    >
      <DeleteConfirmationMessage label={`pembayaran`} />
    </ActionModal>
  );
}
