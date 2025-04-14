"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { MonthlyReport } from "@/types";

export function getMonthlyReportColumns(): ColumnDef<MonthlyReport>[] {
  return [
    {
      accessorKey: "month",
      header: "Month",
    },
    {
      accessorKey: "year",
      header: "Year",
    },
    {
      accessorKey: "total_orders",
      header: "Total Order",
    },
    {
      accessorKey: "total_income",
      header: "Total Income",
      cell: ({ row }) => (
        <div className="font-medium">
          {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(row.getValue("total_income"))}
        </div>
      ),
    },
    {
      accessorKey: "total_expense",
      header: "Total Expense",
      cell: ({ row }) => (
        <div className="font-medium">
          {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(row.getValue("total_expense"))}
        </div>
      ),
    },
  ]
}