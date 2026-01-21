"use client"

import { useDailyMetrics } from "@/lib/hooks/use-daily-metrics"
import { useUIStore } from "@/lib/stores/ui-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3 } from "lucide-react"
import { useMemo } from "react"
import { scaleTime, scaleLinear } from "@visx/scale"
import { Group } from "@visx/group"
import { AreaClosed, LinePath } from "@visx/shape"
import { AxisBottom, AxisLeft } from "@visx/axis"
import { GridRows, GridColumns } from "@visx/grid"
import { defaultStyles, useTooltip, TooltipWithBounds } from "@visx/tooltip"
import { bisector } from "d3-array"
import { curveMonotoneX } from "@visx/curve"
import { localPoint } from "@visx/event"
import { useCallback } from "react"

type TooltipData = {
  date: string
  engagement: number
}

type DataPoint = {
  date: string
  dateObj: Date
  engagement: number
}

const bisectDate = bisector<DataPoint, Date>((d) => d.dateObj).left

// Dimensions
const defaultMargin = { top: 40, right: 40, bottom: 40, left: 60 }

export function EngagementChartVisx() {
  const chartViewType = useUIStore((state) => state.chartViewType)
  const setChartViewType = useUIStore((state) => state.setChartViewType)

  const { data: metrics, isLoading, error } = useDailyMetrics({ days: 30 })

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip<TooltipData>()

  // Transform data
  const chartData = useMemo(() => {
    if (!metrics) return []
    return metrics.map((metric) => ({
      date: new Date(metric.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      dateObj: new Date(metric.date),
      engagement: metric.engagement,
    }))
  }, [metrics])

  // Scales
  const xScale = useMemo(
    () =>
      scaleTime({
        domain: chartData.length
          ? [
              chartData[0].dateObj,
              chartData[chartData.length - 1].dateObj,
            ]
          : [new Date(), new Date()],
        range: [0, 800],
      }),
    [chartData]
  )

  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: chartData.length
          ? [0, Math.max(...chartData.map((d) => d.engagement)) * 1.1]
          : [0, 100],
        range: [400, 0],
      }),
    [chartData]
  )

  // Tooltip handlers
  const handleTooltip = useCallback(
    (
      event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>
    ) => {
      const { x } = localPoint(event) || { x: 0 }
      const x0 = xScale.invert(x)
      const index = bisectDate(chartData, x0, 1)
      const d0 = chartData[index - 1]
      const d1 = chartData[index]
      let d = d0
      if (d1 && d1.dateObj) {
        d =
          x0.getTime() - d0.dateObj.getTime() >
          d1.dateObj.getTime() - x0.getTime()
            ? d1
            : d0
      }
      if (d) {
        showTooltip({
          tooltipData: {
            date: d.date,
            engagement: d.engagement,
          },
          tooltipLeft: xScale(d.dateObj),
          tooltipTop: yScale(d.engagement),
        })
      }
    },
    [showTooltip, chartData, xScale, yScale]
  )

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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Engagement Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] space-y-4">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Engagement Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No data available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

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
        <div className="h-[400px] w-full relative">
          <svg width="100%" height="100%" viewBox="0 0 880 480">
            <Group left={defaultMargin.left} top={defaultMargin.top}>
              {/* Grid */}
              <GridRows
                scale={yScale}
                width={800}
                height={400}
                strokeDasharray="3 3"
                stroke="#e5e7eb"
              />
              <GridColumns
                scale={xScale}
                width={800}
                height={400}
                strokeDasharray="3 3"
                stroke="#e5e7eb"
              />

              {/* Chart */}
              {chartViewType === "area" ? (
                <AreaClosed
                  data={chartData}
                  x={(d) => xScale(d.dateObj)}
                  y={(d) => yScale(d.engagement)}
                  yScale={yScale}
                  curve={curveMonotoneX}
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              ) : (
                <LinePath
                  data={chartData}
                  x={(d) => xScale(d.dateObj)}
                  y={(d) => yScale(d.engagement)}
                  curve={curveMonotoneX}
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              )}

              {/* Tooltip indicator line */}
              {tooltipOpen && tooltipData && tooltipLeft && (
                <Group>
                  <line
                    x1={tooltipLeft}
                    y1={0}
                    x2={tooltipLeft}
                    y2={400}
                    stroke="#8884d8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    pointerEvents="none"
                  />
                  <circle
                    cx={tooltipLeft}
                    cy={tooltipTop}
                    r={4}
                    fill="#8884d8"
                    stroke="white"
                    strokeWidth={2}
                  />
                </Group>
              )}

              {/* Interactive overlay for tooltip */}
              <rect
                x={0}
                y={0}
                width={800}
                height={400}
                fill="transparent"
                onTouchStart={handleTooltip}
                onTouchMove={handleTooltip}
                onMouseMove={handleTooltip}
                onMouseLeave={hideTooltip}
              />

              {/* Axes */}
              <AxisBottom
                top={400}
                scale={xScale}
                numTicks={6}
                stroke="#6b7280"
                tickStroke="#6b7280"
                tickLabelProps={{
                  fill: "#6b7280",
                  fontSize: 12,
                  textAnchor: "middle",
                }}
              />
              <AxisLeft
                scale={yScale}
                stroke="#6b7280"
                tickStroke="#6b7280"
                tickLabelProps={{
                  fill: "#6b7280",
                  fontSize: 12,
                  textAnchor: "end",
                  dx: -10,
                }}
              />
            </Group>
          </svg>

          {/* Tooltip */}
          {tooltipOpen && tooltipData && tooltipLeft && tooltipTop && (
            <TooltipWithBounds
              top={tooltipTop + defaultMargin.top}
              left={tooltipLeft + defaultMargin.left}
              style={{
                ...defaultStyles,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                color: "white",
                padding: "8px 12px",
                borderRadius: "6px",
              }}
            >
              <div className="text-sm">
                <div className="font-semibold">{tooltipData.date}</div>
                <div>Engagement: {tooltipData.engagement.toLocaleString()}</div>
              </div>
            </TooltipWithBounds>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded"
              style={{
                backgroundColor: "#8884d8",
                opacity: chartViewType === "area" ? 0.6 : 1,
              }}
            />
            <span className="text-sm text-muted-foreground">Engagement</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
