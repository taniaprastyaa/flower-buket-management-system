"use client";

import { useState, useEffect } from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { DataTable } from "@/components/dashboard/datatable/datatable";
import { DataTablePagination } from "@/components/dashboard/datatable/datatable-pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useStatisticStore } from "@/stores/statisticStore";
import { getOrderOverviewColumns } from "@/components/dashboard/datatable/columns/order-overview";
import { TableSearch } from "./datatable/table-search";

export default function OrderOverviewDatatable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const { orderOverview, fetchOrderOverview, loading} = useStatisticStore();

  useEffect(() => {
    const getOrderOverview = async () => {
      try {
        await fetchOrderOverview();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Terjadi kesalahan saat mengambil data material");
        }
      }
    };
    getOrderOverview();
  }, [fetchOrderOverview]);

  const table = useReactTable({
    data: orderOverview,
    columns: getOrderOverviewColumns(),
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
            <CardTitle>Order Overview</CardTitle>
            <div className="flex gap-5 items-center mt-2">
                <TableSearch value={globalFilter} onChange={setGlobalFilter} />
            </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <DataTable table={table} columnsLength={getOrderOverviewColumns().length} />
              <DataTablePagination table={table} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}