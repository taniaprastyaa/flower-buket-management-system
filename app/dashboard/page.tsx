import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive"
import { SectionCards } from "@/components/dashboard/section-cards"

export default function Dashboard() {
  return(
      <>
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
      </>
  )
}