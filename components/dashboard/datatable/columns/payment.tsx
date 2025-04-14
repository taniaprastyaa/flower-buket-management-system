"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableActions } from "@/components/dashboard/datatable/datatable-actions"
import type { Payment } from "@/types";


type PaymentColumnsProps = {
  actions?: (row: Payment) => { label: string; onClick: () => void }[]
}

export function getPaymentColumns({ actions }: PaymentColumnsProps): ColumnDef<Payment>[] {
  return [
    {
        accessorKey: "order_code",
        header: "Order Code",
    },
    {
        accessorKey: "customer_name",
        header: "Customer Name",
    },
    {
        accessorKey: "payment_date",
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