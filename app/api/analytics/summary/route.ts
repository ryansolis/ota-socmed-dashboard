import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { AnalyticsSummary } from "@/lib/hooks/use-analytics-summary"
import { rateLimit, getRateLimitIdentifier } from "@/lib/middleware/rate-limit"
import { logger } from "@/lib/utils/logger"

// Rate limiter: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
})

export async function GET(request: Request) {
  const startTime = Date.now()
  
  try {
    // Rate limiting
    const identifier = getRateLimitIdentifier(request)
    const limitResult = limiter(identifier)

    if (!limitResult.allowed) {
      const duration = Date.now() - startTime
      logger.warn("Rate limit exceeded", {
        identifier,
        path: "/api/analytics/summary",
        duration: `${duration}ms`,
      })
      
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((limitResult.resetTime - Date.now()) / 1000).toString(),
            "X-RateLimit-Limit": "100",
            "X-RateLimit-Remaining": limitResult.remaining.toString(),
            "X-RateLimit-Reset": new Date(limitResult.resetTime).toISOString(),
          },
        }
      )
    }

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

    const duration = Date.now() - startTime
    logger.request("GET", "/api/analytics/summary", 200, duration, {
      userId: user.id,
      postsCount: posts.length,
    })
    
    const response = NextResponse.json(summary)
    
    // Add rate limit headers
    response.headers.set("X-RateLimit-Limit", "100")
    response.headers.set("X-RateLimit-Remaining", limitResult.remaining.toString())
    response.headers.set("X-RateLimit-Reset", new Date(limitResult.resetTime).toISOString())
    
    return response
  } catch (error) {
    const duration = Date.now() - startTime
    logger.error("Error in analytics summary", {
      error: error instanceof Error ? error.message : String(error),
      duration: `${duration}ms`,
    })
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
