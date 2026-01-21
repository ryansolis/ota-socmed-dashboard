import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const runtime = "edge"

export async function GET(request: Request) {
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

    return NextResponse.json(metrics || [])
  } catch (error) {
    console.error("Error in daily metrics:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
