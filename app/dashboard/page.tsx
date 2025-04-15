import OrderOverviewDatatable from "@/components/dashboard/order-overview-datatable"
import { SectionCards } from "@/components/dashboard/section-cards"

export default function Dashboard() {
  return(
      <>
        <SectionCards />
        <OrderOverviewDatatable />
      </>
  )
}