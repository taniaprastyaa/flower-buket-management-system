"use client";

import { useState, useEffect } from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { DataTable } from "@/components/dashboard/datatable/datatable";
import { DataTablePagination } from "@/components/dashboard/datatable/datatable-pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useStatisticStore } from "@/stores/statisticStore";
import { getMonthlyReportColumns } from "@/components/dashboard/datatable/columns/monthly-report";
import { TableSearch } from "@/components/dashboard/datatable/table-search";

export default function MaterialPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const { monthlyReports, fetchMonthlyReports, loading} = useStatisticStore();

  useEffect(() => {
    const getMonthlyReports = async () => {
      try {
        await fetchMonthlyReports();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An error occurred while retrieving monthly report");
        }
      }
    };
    getMonthlyReports();
  }, [fetchMonthlyReports]);

  const table = useReactTable({
    data: monthlyReports,
    columns: getMonthlyReportColumns(),
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
          <CardTitle>Monthly Reports</CardTitle>
          <div className="flex gap-5 items-center mt-2">
            <TableSearch value={globalFilter} onChange={setGlobalFilter} />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <DataTable table={table} columnsLength={getMonthlyReportColumns().length} />
              <DataTablePagination table={table} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}