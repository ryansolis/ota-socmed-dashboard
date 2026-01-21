import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { AnalyticsSummary } from "@/lib/hooks/use-analytics-summary"

export async function GET() {
  try {
    const supabase = await createClient()

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Fetch all posts for the user
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", user.id)

    if (postsError) {
      return NextResponse.json(
        { error: `Failed to fetch posts: ${postsError.message}` },
        { status: 500 }
      )
    }

    if (!posts || posts.length === 0) {
      // Return empty summary for users with no posts
      const summary: AnalyticsSummary = {
        totalEngagement: 0,
        averageEngagementRate: 0,
        topPerformingPost: null,
        engagementTrend: {
          current: 0,
          previous: 0,
          percentageChange: 0,
        },
      }
      return NextResponse.json(summary)
    }

    // Calculate total engagement (likes + comments + shares)
    const totalEngagement = posts.reduce(
      (sum, post) => sum + post.likes + post.comments + post.shares,
      0
    )

    // Calculate average engagement rate
    const postsWithEngagementRate = posts.filter(
      (post) => post.engagement_rate !== null
    )
    const averageEngagementRate =
      postsWithEngagementRate.length > 0
        ? postsWithEngagementRate.reduce(
            (sum, post) => sum + (post.engagement_rate || 0),
            0
          ) / postsWithEngagementRate.length
        : 0

    // Find top performing post (highest engagement)
    const topPerformingPost = posts.reduce(
      (top, post) => {
        const engagement = post.likes + post.comments + post.shares
        const topEngagement = top.likes + top.comments + top.shares
        return engagement > topEngagement ? post : top
      },
      posts[0]
    )

    // Calculate trend: last 7 days vs previous 7 days
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    const currentPeriodPosts = posts.filter(
      (post) => new Date(post.posted_at) >= sevenDaysAgo
    )
    const previousPeriodPosts = posts.filter(
      (post) =>
        new Date(post.posted_at) >= fourteenDaysAgo &&
        new Date(post.posted_at) < sevenDaysAgo
    )

    const currentEngagement = currentPeriodPosts.reduce(
      (sum, post) => sum + post.likes + post.comments + post.shares,
      0
    )
    const previousEngagement = previousPeriodPosts.reduce(
      (sum, post) => sum + post.likes + post.comments + post.shares,
      0
    )

    const percentageChange =
      previousEngagement > 0
        ? ((currentEngagement - previousEngagement) / previousEngagement) * 100
        : currentEngagement > 0
        ? 100
        : 0

    const summary: AnalyticsSummary = {
      totalEngagement,
      averageEngagementRate: Math.round(averageEngagementRate * 100) / 100,
      topPerformingPost: {
        id: topPerformingPost.id,
        caption: topPerformingPost.caption,
        engagement:
          topPerformingPost.likes +
          topPerformingPost.comments +
          topPerformingPost.shares,
        platform: topPerformingPost.platform,
      },
      engagementTrend: {
        current: currentEngagement,
        previous: previousEngagement,
        percentageChange: Math.round(percentageChange * 100) / 100,
      },
    }

    return NextResponse.json(summary)
  } catch (error) {
    console.error("Error in analytics summary:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
