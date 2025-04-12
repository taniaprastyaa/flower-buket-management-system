"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableActions } from "@/components/dashboard/datatable/datatable-actions"
import type { Material } from "@/types";


type MaterialColumnsProps = {
  actions?: (row: Material) => { label: string; onClick: () => void }[]
}

export function getMaterialColumns({ actions }: MaterialColumnsProps): ColumnDef<Material>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "stock",
      header: "Stock",
    },
    {
      accessorKey: "unit",
      header: "Unit",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(row.getValue("price"))}
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