"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { OrderOverview } from "@/types";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx"; 

export function getOrderOverviewColumns(): ColumnDef<OrderOverview>[] {
  return [
    {
      accessorKey: "order_code",
      header: "Order Code",
    },
    {
      accessorKey: "customer_name",
      header: "Buket Name",
    },
    {
      accessorKey: "deadline",
      header: "Deadline",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue<string>("status");

        const statusColor = {
          Pending: "bg-yellow-100 text-yellow-800",
          "In Progress": "bg-blue-100 text-blue-800",
          Completed: "bg-green-100 text-green-800",
          Canceled: "bg-red-100 text-red-800",
        };

        return (
          <Badge className={clsx("text-xs font-medium px-2.5 py-0.5 rounded", statusColor[status as keyof typeof statusColor])}>
            {status}
          </Badge>
        );
      },
    },
  ];
}
