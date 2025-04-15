import { ActionModal } from "@/components/dashboard/dialogs/action-modal";
import { useMaterialStore } from "@/stores/materialStore";
import { useState } from "react";
import { toast } from "sonner";
import { deleteMaterialRequest } from "@/requests/material/delete";
import { DeleteConfirmationMessage } from "@/components/ui/delete-confirmation-message";

interface DeleteMaterialDialogProps {
  open: boolean;
  onClose: () => void;
  materialId: string;
  materialName: string;
}

export function DeleteMaterialDialog({ open, onClose, materialId, materialName,
}: DeleteMaterialDialogProps) {
  const { fetchMaterials } = useMaterialStore();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteMaterialRequest(materialId);

    if (result.success) {
      await fetchMaterials();
      toast.success(result.message);
      onClose();
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <ActionModal open={open} onClose={onClose} type="delete" title={`Delete Material ${materialName}?`} onSubmit={handleDelete} loading={loading} >
      <DeleteConfirmationMessage label={`material ${materialName}`} />
    </ActionModal>
  );
}