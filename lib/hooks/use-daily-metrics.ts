"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { queryKeys } from "./query-keys"

export type DailyMetric = {
  id: string
  user_id: string
  date: string
  engagement: number
  reach: number
  created_at: string
}

type UseDailyMetricsOptions = {
  days?: number
  enabled?: boolean
}

export function useDailyMetrics(options: UseDailyMetricsOptions = {}) {
  const { days = 30, enabled = true } = options

  return useQuery({
    queryKey: queryKeys.dailyMetrics.list(days),
    queryFn: async () => {
      const supabase = createClient()

      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await supabase
        .from("daily_metrics")
        .select("*")
        .gte("date", startDate.toISOString().split("T")[0])
        .order("date", { ascending: true })

      if (error) {
        throw new Error(`Failed to fetch daily metrics: ${error.message}`)
      }

      return (data || []) as DailyMetric[]
    },
    enabled,
  })
}
