"use client";

import { useState, useEffect } from "react";
import { useOrderStore } from "@/stores/orderStore";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { getOrderColumns } from "@/components/dashboard/datatable/columns/orders";
import { DataTable } from "@/components/dashboard/datatable/datatable";
import { DataTablePagination } from "@/components/dashboard/datatable/datatable-pagination";
import { TableSearch } from "@/components/dashboard/datatable/table-search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function OrderPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const { orders, fetchOrders, loading } = useOrderStore();

  useEffect(() => {
    const getOrders = async () => {
      try {
        await fetchOrders();
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    getOrders();
  }, [fetchOrders]);

  const table = useReactTable({
    data: orders,
    columns: getOrderColumns({
      actions: (row) => [
        {
          label: "Copy Order Code",
          onClick: () => {
            navigator.clipboard.writeText(row.order_code);
          },
        },
        {
          label: "View Details",
          onClick: () => {
            console.log("View details for order:", row.order_code);
          },
        },
        {
          label: "Update",
          onClick: () => {
            console.log("Update details for order:", row.order_code);
          },
        },
        {
          label: "Delete",
          onClick: () => {
            console.log("Deleting order:", row.order_code);
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
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <DataTable table={table} columnsLength={getOrderColumns({}).length} />
              <DataTablePagination table={table} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}