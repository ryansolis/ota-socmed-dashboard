import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { rateLimit, getRateLimitIdentifier } from "@/lib/middleware/rate-limit"
import { logger } from "@/lib/utils/logger"

export const runtime = "edge"

// Rate limiter: 100 requests per 15 minutes per IP
const rateLimitOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
}

export async function GET(request: Request) {
  const startTime = Date.now()
  
  try {
    // Rate limiting
    const identifier = getRateLimitIdentifier(request)
    const limitResult = await rateLimit(rateLimitOptions, identifier)

    if (!limitResult.allowed) {
      const duration = Date.now() - startTime
      logger.warn("Rate limit exceeded", {
        identifier,
        path: "/api/metrics/daily",
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

    // Get days parameter from query string (default to 30)
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get("days") || "30", 10)

    if (isNaN(days) || days < 1 || days > 365) {
      return NextResponse.json(
        { error: "Invalid days parameter. Must be between 1 and 365." },
        { status: 400 }
      )
    }

    // Calculate start date
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Fetch daily metrics
    const { data: metrics, error: metricsError } = await supabase
      .from("daily_metrics")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", startDate.toISOString().split("T")[0])
      .order("date", { ascending: true })

    if (metricsError) {
      return NextResponse.json(
        { error: `Failed to fetch metrics: ${metricsError.message}` },
        { status: 500 }
      )
    }

    const duration = Date.now() - startTime
    logger.request("GET", "/api/metrics/daily", 200, duration, {
      userId: user.id,
      days: parseInt(new URL(request.url).searchParams.get("days") || "30"),
      metricsCount: metrics?.length || 0,
    })
    
    const response = NextResponse.json(metrics || [])
    
    // Add rate limit headers
    response.headers.set("X-RateLimit-Limit", "100")
    response.headers.set("X-RateLimit-Remaining", limitResult.remaining.toString())
    response.headers.set("X-RateLimit-Reset", new Date(limitResult.resetTime).toISOString())
    
    return response
  } catch (error) {
    const duration = Date.now() - startTime
    logger.error("Error in daily metrics", {
      error: error instanceof Error ? error.message : String(error),
      duration: `${duration}ms`,
    })
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
