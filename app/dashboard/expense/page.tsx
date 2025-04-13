"use client";

import { useState, useEffect } from "react";
import { useExpenseStore } from "@/stores/expenseStore";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { getExpenseColumns } from "@/components/dashboard/datatable/columns/expense";
import { DataTable } from "@/components/dashboard/datatable/datatable";
import { DataTablePagination } from "@/components/dashboard/datatable/datatable-pagination";
import { TableSearch } from "@/components/dashboard/datatable/table-search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CreateExpenseModal from "@/components/dashboard/forms/expense/create";
import UpdateExpenseModal from "@/components/dashboard/forms/expense/update";
import { DeleteExpenseDialog } from "@/components/dashboard/forms/expense/delete";
import type { Expense } from "@/types";

export default function ExpensePage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const { expenses, fetchExpenses, loading } = useExpenseStore();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState("");
  const [selectedExpenseName, setSelectedExpenseName] = useState("");


  useEffect(() => {
    const getExpenses = async () => {
      try {
        await fetchExpenses();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Terjadi kesalahan saat mengambil data expense");
        }
      }
    };
    getExpenses();
  }, [fetchExpenses]);

  const table = useReactTable({
    data: expenses,
    columns: getExpenseColumns({
      actions: (row) => [
        {
          label: "Update",
          onClick: () => {
            setSelectedExpense(row);
            setOpenUpdateModal(true);
          },
        },
        {
          label: "Delete",
          onClick: async () => {
            setSelectedExpenseId(row.id);
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
          <CardTitle>Expense List</CardTitle>
          <div className="flex gap-5 items-center mt-2">
            <TableSearch value={globalFilter} onChange={setGlobalFilter} />
            <Button onClick={() => setOpenCreateModal(true)}>
              <IconPlus className="w-5 h-5 mr-2" /> Create Expense
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <DataTable table={table} columnsLength={getExpenseColumns({}).length} />
              <DataTablePagination table={table} />
            </>
          )}
        </CardContent>
      </Card>
      <CreateExpenseModal open={openCreateModal} onClose={() => setOpenCreateModal(false)} />
      <UpdateExpenseModal open={openUpdateModal} onClose={() => setOpenUpdateModal(false)} expense={selectedExpense} />
      <DeleteExpenseDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} expenseId={selectedExpenseId} expenseName={selectedExpenseName} />
    </div>
  );
}