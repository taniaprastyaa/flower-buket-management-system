"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableActions } from "@/components/dashboard/datatable/datatable-actions"
import type { Expense } from "@/types";


type ExpenseColumnsProps = {
  actions?: (row: Expense) => { label: string; onClick: () => void }[]
}

export function getExpenseColumns({ actions }: ExpenseColumnsProps): ColumnDef<Expense>[] {
  return [
    {
        accessorKey: "material_name",
        header: "Material Name",
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
    },
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
            <div className="font-medium">
            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(row.getValue("amount"))}
            </div>
        ),
    },
    {
      id: "actions",
      cell: ({ row }) =>
        actions ? <DataTableActions row={row.original} actions={actions(row.original)} /> : null,
    },
  ]
}