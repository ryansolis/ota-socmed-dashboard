"use client"

import { useAnalyticsSummary } from "@/lib/hooks/use-analytics-summary"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUp, ArrowDown, TrendingUp, BarChart3, Heart } from "lucide-react"

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

export function SummaryCards() {
  const { data: summary, isLoading, error } = useAnalyticsSummary()

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Error loading data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-destructive">Failed to load metrics</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-20 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!summary) {
    return null
  }

  const trend = summary.engagementTrend
  const isTrendUp = trend.percentageChange >= 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Engagement */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(summary.totalEngagement)}</div>
          <p className="text-xs text-muted-foreground">
            Across all posts
          </p>
        </CardContent>
      </Card>

      {/* Average Engagement Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Engagement Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {summary.averageEngagementRate.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            Average across posts
          </p>
        </CardContent>
      </Card>

      {/* Top Performing Post */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Post</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {summary.topPerformingPost
              ? formatNumber(summary.topPerformingPost.engagement)
              : "N/A"}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {summary.topPerformingPost
              ? `${summary.topPerformingPost.platform.charAt(0).toUpperCase() + summary.topPerformingPost.platform.slice(1)}`
              : "No posts yet"}
          </p>
        </CardContent>
      </Card>

      {/* Engagement Trend */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">7-Day Trend</CardTitle>
          {isTrendUp ? (
            <ArrowUp className="h-4 w-4 text-green-600" />
          ) : (
            <ArrowDown className="h-4 w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isTrendUp ? "+" : ""}
            {trend.percentageChange.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            vs previous 7 days
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
