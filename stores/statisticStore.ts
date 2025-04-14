import { create } from "zustand";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { MonthlyReport } from "@/types";

const supabase = createClientComponentClient();

interface StatisticState {
  monthlyReports: MonthlyReport[];
  loading: boolean;
  fetchMonthlyReports: () => Promise<void>;
}

export const useStatisticStore = create<StatisticState>((set) => ({
  monthlyReports: [],
  loading: false,
  fetchMonthlyReports: async () => {
    set({ loading: true });

    const { data, error } = await supabase
      .from("monthly_report")
      .select("*")
      .order("year", { ascending: true })
      .order("month", { ascending: true });

    set({ loading: false });

    if (error) {
      throw new Error("Gagal mengambil laporan bulanan");
    }

    set({ monthlyReports: data });
  },
}));
