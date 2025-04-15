"use client"

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "../../ui/mode-toggle"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/order": "Orders Page",
  "/dashboard/order/[id]": "Order Detail Page",
  "/dashboard/order/[id]/update": "Update Order Page",
  "/dashboard/material": "Material Page",
  "/dashboard/payment": "Payments Page",
  "/dashboard/expense": "Expense Transaction Page",
  "/dashboard/monthly-report": "Monthly Reports Page",
}

function getDynamicTitle(pathname: string): string {
  if (/^\/dashboard\/order\/[^\/]+$/.test(pathname)) {
    return pageTitles["/dashboard/order/[id]"]
  }

  if (/^\/dashboard\/order\/[^\/]+\/update$/.test(pathname)) {
    return pageTitles["/dashboard/order/[id]/update"]
  }

  return pageTitles[pathname] ?? "Dashboard"
}

export function SiteHeader() {
  const pathname = usePathname()
  const title = getDynamicTitle(pathname)

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}