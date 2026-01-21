import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { PostsTable } from "@/components/dashboard/posts-table"
import { EngagementChartVisx } from "@/components/dashboard/engagement-chart-visx"
import { PostDetailModal } from "@/components/dashboard/post-detail-modal"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Track and analyze your social media engagement metrics
        </p>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Engagement Chart */}
      <EngagementChartVisx />

      {/* Posts Table */}
      <PostsTable />

      {/* Post Detail Modal */}
      <PostDetailModal />
    </div>
  )
}