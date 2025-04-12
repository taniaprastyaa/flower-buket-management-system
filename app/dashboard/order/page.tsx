"use client";

import { useState, useEffect } from "react";
import { useOrderStore } from "@/stores/orderStore";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { getOrderColumns } from "@/components/dashboard/datatable/columns/order";
import { DataTable } from "@/components/dashboard/datatable/datatable";
import { DataTablePagination } from "@/components/dashboard/datatable/datatable-pagination";
import { TableSearch } from "@/components/dashboard/datatable/table-search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DeleteOrderDialog } from "@/components/dashboard/forms/order/delete";

export default function OrderPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const { orders, fetchOrders, loading} = useOrderStore();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedOrderCode, setSelectedOrderCode] = useState("");

  useEffect(() => {
    const getOrders = async () => {
      try {
        await fetchOrders();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Terjadi kesalahan saat mengambil data order");
        }
      }
    };
    getOrders();
  }, [fetchOrders]);

  const table = useReactTable({
    data: orders,
    columns: getOrderColumns({
      actions: (row) => [
        {
          label: "View Details",
          onClick: () => {
            router.push(`/dashboard/order/${row.id}`);
          },
        },
        {
          label: "Update",
          onClick: () => {
            router.push(`/dashboard/order/${row.id}/update`);
          },
        },
        {
          label: "Delete",
          onClick: async () => {
            setSelectedOrderId(row.id);
            setSelectedOrderCode(row.order_code);
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
      <DeleteOrderDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} orderId={selectedOrderId} orderCode={selectedOrderCode} />
    </div>
  );
}