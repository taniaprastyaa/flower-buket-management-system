"use client";

import { useState, useEffect } from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { getPaymentColumns } from "@/components/dashboard/datatable/columns/payment";
import { DataTable } from "@/components/dashboard/datatable/datatable";
import { DataTablePagination } from "@/components/dashboard/datatable/datatable-pagination";
import { TableSearch } from "@/components/dashboard/datatable/table-search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { usePaymentStore } from "@/stores/paymentStore";
import CreatePaymentModal from "@/components/dashboard/forms/payment/create";
import { Payment } from "@/types";
import UpdatePaymentModal from "@/components/dashboard/forms/payment/update";
import { DeletePaymentDialog } from "@/components/dashboard/forms/payment/delete";

export default function PaymentPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const { payments, fetchPayments, loading} = usePaymentStore();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState("");

  useEffect(() => {
    const getPayments = async () => {
      try {
        await fetchPayments();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An error occurred while retrieving payment data");
        }
      }
    };
    getPayments();
  }, [fetchPayments]);

  const table = useReactTable({
    data: payments,
    columns: getPaymentColumns({
      actions: (row) => [
        {
          label: "Update",
          onClick: () => {
            setSelectedPayment(row);
            setOpenUpdateModal(true);
          },
        },
        {
          label: "Delete",
          onClick: async () => {
            setSelectedPaymentId(row.id);
            setDeleteDialogOpen(true);
          },
        },
      ],
    }),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });  

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment List</CardTitle>
          <div className="flex gap-5 items-center mt-2">
            <TableSearch value={globalFilter} onChange={setGlobalFilter} />
            <Button onClick={() => setOpenCreateModal(true)}>
              <IconPlus className="w-5 h-5 mr-2" /> Create Payment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <DataTable table={table} columnsLength={getPaymentColumns({}).length} />
              <DataTablePagination table={table} />
            </>
          )}
        </CardContent>
      </Card>
      <CreatePaymentModal open={openCreateModal} onClose={() => setOpenCreateModal(false)} />
      <UpdatePaymentModal open={openUpdateModal} onClose={() => setOpenUpdateModal(false)} payment={selectedPayment} />
      <DeletePaymentDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} paymentId={selectedPaymentId}/>
    </div>
  );
}