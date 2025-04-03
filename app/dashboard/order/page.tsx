"use client"

import { useState } from "react"
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel } from "@tanstack/react-table"
import { getOrderColumns } from "@/components/DataTable/columns/orders"
import { DataTable } from "@/components/DataTable/DataTable"
import { DataTablePagination } from "@/components/DataTable/DataTablePagination"
import { TableSearch } from "@/components/DataTable/TableSearch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const orders = [
  { order_code: "ORD-20240403-0001", customer_name: "Budi Santoso", contact: "08123456789", notes: "Cepat ya!", total_price: 150000 },
  { order_code: "ORD-20240403-0002", customer_name: "Siti Aminah", contact: "08223344556", notes: "Tambah kartu ucapan", total_price: 200000 },
]

const orderActions = (row: { order_code: string }) => [
  { label: "Copy Order Code", onClick: () => navigator.clipboard.writeText(row.order_code) },
  { label: "View Details", onClick: () => console.log("View details", row) },
  { label: "Delete", onClick: () => console.log(`Deleting order: ${row.order_code}`) },
]

export default function Orders() {
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data: orders,
    columns: getOrderColumns({ actions: orderActions }),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  })

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
          <div className="flex gap-5 items-center mt-2">
            <TableSearch value={globalFilter} onChange={setGlobalFilter} />
            <Button asChild>
              <Link href="/dashboard/order/create">
                <IconPlus className="w-5 h-5 mr-2" /> Create Order
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable table={table} columnsLength={getOrderColumns({}).length} />
          <DataTablePagination table={table} />
        </CardContent>
      </Card>
    </div>
  )
}