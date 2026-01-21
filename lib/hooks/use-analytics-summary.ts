"use client"

import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "./query-keys"

export type AnalyticsSummary = {
  totalEngagement: number
  averageEngagementRate: number
  topPerformingPost: {
    id: string
    caption: string | null
    engagement: number
    platform: string
  } | null
  engagementTrend: {
    current: number
    previous: number
    percentageChange: number
  }
}

export function useAnalyticsSummary() {
  return useQuery({
    queryKey: queryKeys.analytics.summary(),
    queryFn: async () => {
      const response = await fetch("/api/analytics/summary")

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Failed to fetch analytics summary" }))
        throw new Error(error.message || "Failed to fetch analytics summary")
      }

      return response.json() as Promise<AnalyticsSummary>
    },
  })
}
