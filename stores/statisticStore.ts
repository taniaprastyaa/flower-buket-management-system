import { create } from "zustand";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { MonthlyReport, OrderOverview, OrderStatusCount } from "@/types";

const supabase = createClientComponentClient();

interface StatisticState {
  monthlyReports: MonthlyReport[];
  totalInProgress: number;
  totalPending: number;
  totalCompleted: number;
  totalCanceled: number;
  loading: boolean;
  fetchMonthlyReports: () => Promise<void>;
  fetchOrderStatusCounts: () => Promise<void>;
  orderOverview: OrderOverview[];
  fetchOrderOverview: () => Promise<void>;
}

export const useStatisticStore = create<StatisticState>((set) => ({
  monthlyReports: [],
  totalInProgress: 0,
  totalPending: 0,
  totalCompleted: 0,
  totalCanceled: 0,
  loading: false,
  orderOverview: [],

    fetchMonthlyReports: async () => {
        set({ loading: true });

        const { data, error } = await supabase
        .from("monthly_report")
        .select("*")
        .order("year", { ascending: true })
        .order("month", { ascending: true });

        set({ loading: false });

        if (error) {
        throw new Error("Failed to take monthly report");
        }

        set({ monthlyReports: data });
    },

    fetchOrderStatusCounts: async () => {
        set({ loading: true });
      
        const { data, error } = await supabase.rpc("get_order_status_counts");
      
        set({ loading: false });
      
        if (error) {
          throw new Error("Failed to retrieve order status statistics");
        }
      
        const statusCounts = {
          InProgress: 0,
          Pending: 0,
          Completed: 0,
          Canceled: 0,
        };
      
        (data as OrderStatusCount[])?.forEach((row) => {
            switch (row.status) {
              case "In Progress":
                statusCounts.InProgress = row.total;
                break;
              case "Pending":
                statusCounts.Pending = row.total;
                break;
              case "Completed":
                statusCounts.Completed = row.total;
                break;
              case "Canceled":
                statusCounts.Canceled = row.total;
                break;
            }
          });          
      
        set({
          totalInProgress: statusCounts.InProgress,
          totalPending: statusCounts.Pending,
          totalCompleted: statusCounts.Completed,
          totalCanceled: statusCounts.Canceled,
        });
      },
      
      fetchOrderOverview: async () => {
        set({ loading: true });
      
        const { data, error } = await supabase
          .from("view_order_overview")
          .select("*")
          .order("deadline", { ascending: true });
      
        set({ loading: false });
      
        if (error) {
          throw new Error("Failed to retrieve order summary data");
        }
      
        set({ orderOverview: data });
      }      
}));
