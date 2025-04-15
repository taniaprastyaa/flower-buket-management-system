import { ActionModal } from "@/components/dashboard/dialogs/action-modal";
import { useExpenseStore } from "@/stores/expenseStore";
import { useState } from "react";
import { toast } from "sonner";
import { deleteExpenseRequest } from "@/requests/expense/delete";
import { DeleteConfirmationMessage } from "@/components/ui/delete-confirmation-message";

interface DeleteExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  expenseId: string;
}

export function DeleteExpenseDialog({ open, onClose, expenseId,
}: DeleteExpenseDialogProps) {
  const { fetchExpenses } = useExpenseStore();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteExpenseRequest(expenseId);

    if (result.success) {
      await fetchExpenses();
      toast.success(result.message);
      onClose();
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <ActionModal open={open} onClose={onClose} type="delete" title={`Delete Expense?`} onSubmit={handleDelete} loading={loading}>
      <DeleteConfirmationMessage label={`expense`} />
    </ActionModal>
  );
}