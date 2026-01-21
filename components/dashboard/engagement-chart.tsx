"use client"

import { useDailyMetrics } from "@/lib/hooks/use-daily-metrics"
import { useUIStore } from "@/lib/stores/ui-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { ChartBar } from "lucide-react"

export function EngagementChart() {
  const chartViewType = useUIStore((state) => state.chartViewType)
  const setChartViewType = useUIStore((state) => state.setChartViewType)

  const { data: metrics, isLoading, error } = useDailyMetrics({ days: 30 })

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Engagement Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">Failed to load chart data</p>
        </CardContent>
      </Card>
    )
  }

  // Transform data for Recharts
  const chartData =
    metrics?.map((metric) => ({
      date: new Date(metric.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      engagement: metric.engagement,
      reach: metric.reach,
    })) || []

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Engagement Trend</CardTitle>
            <CardDescription>Last 30 days of engagement metrics</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={chartViewType === "line" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartViewType("line")}
            >
              Line
            </Button>
            <Button
              variant={chartViewType === "area" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartViewType("area")}
            >
              Area
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[400px] space-y-4">
            <Skeleton className="h-full w-full" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <ChartBar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No data available</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            {chartViewType === "line" ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Engagement"
                />
              </LineChart>
            ) : (
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="engagement"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                  name="Engagement"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
