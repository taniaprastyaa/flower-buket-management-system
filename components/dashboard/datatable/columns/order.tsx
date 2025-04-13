"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableActions } from "@/components/dashboard/datatable/datatable-actions"
import type { Order } from "@/types";


type OrderColumnsProps = {
  actions?: (row: Order) => { label: string; onClick: () => void }[]
}

export function getOrderColumns({ actions }: OrderColumnsProps): ColumnDef<Order>[] {
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
      accessorKey: "contact",
      header: "Contact",
    },
    {
      accessorKey: "payment_status",
      header: "Payment Status",
    },
    {
      accessorKey: "total_price",
      header: "Total Price",
      cell: ({ row }) => (
        <div className="font-medium">
          {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(row.getValue("total_price"))}
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
