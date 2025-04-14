"use client"

import * as React from "react"
import {
  IconCalendarStats,
  IconClipboardList,
  IconDashboard,
  IconInnerShadowTop,
  IconPackage,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react"

import { NavMain } from "@/components/dashboard/sidebar/nav-main"
import { NavUser } from "@/components/dashboard/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavSecondary } from "./nav-secondary"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/owner.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Orders",
      url: "/dashboard/order",
      icon: IconClipboardList,
    },
    {
      title: "Material",
      url: "/dashboard/material",
      icon: IconPackage,
    },
  ],
  documents: [
    {
      title: "Payments", // sebelumnya: name
      url: "/dashboard/payment",
      icon: IconTrendingUp,
    },
    {
      title: "Expense Transaction",
      url: "/dashboard/expense",
      icon: IconTrendingDown,
    },
    {
      title: "Monthly Reports",
      url: "/dashboard/monthly-report",
      icon: IconCalendarStats,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Floista.co</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.documents} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
