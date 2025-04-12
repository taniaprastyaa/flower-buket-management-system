interface DeleteConfirmationMessageProps {
    label: string;
  }
  
  export function DeleteConfirmationMessage({ label }: DeleteConfirmationMessageProps) {
    return (
      <p>
        Apakah kamu yakin ingin menghapus <strong>{label}</strong>? Aksi ini akan menghapus data secara permanen.
      </p>
    );
  }
  