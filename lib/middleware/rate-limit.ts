/**
 * Redis-based rate limiter for production use
 * Uses Upstash Redis which is serverless-friendly and works with Edge Functions
 * 
 * Implements a sliding window counter algorithm:
 * - Uses INCR to atomically increment the counter
 * - Sets expiration equal to the window duration
 * - Checks count against maxRequests threshold
 */

import { getRedisClient } from "@/lib/redis/client"

interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
}

/**
 * Redis-based rate limiter
 * Uses a sliding window counter algorithm with Redis
 */
export async function rateLimit(
  options: RateLimitOptions,
  identifier: string
): Promise<RateLimitResult> {
  const { windowMs, maxRequests } = options
  const now = Date.now()
  const key = `ratelimit:${identifier}`
  const resetTime = now + windowMs

  try {
    const redis = getRedisClient()

    // Increment counter atomically
    // This returns the new count after increment
    const currentCount = await redis.incr(key)

    // Set expiration on first request (when count = 1)
    if (currentCount === 1) {
      // Use PEXPIRE to set expiration in milliseconds
      await redis.pexpire(key, windowMs)
    }

    // Check if limit exceeded
    if (currentCount > maxRequests) {
      // Get TTL to calculate actual reset time
      const ttl = await redis.pttl(key)
      const actualResetTime = ttl > 0 ? now + ttl : resetTime

      return {
        allowed: false,
        remaining: 0,
        resetTime: actualResetTime,
      }
    }

    return {
      allowed: true,
      remaining: Math.max(0, maxRequests - currentCount),
      resetTime: resetTime,
    }
  } catch (error) {
    // Fallback: allow request if Redis fails (fail open)
    // In production, you might want to fail closed instead
    console.error("Rate limit Redis error:", error)
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: resetTime,
    }
  }
}

/**
 * Get rate limit identifier from request
 */
export function getRateLimitIdentifier(request: Request): string {
  // Use IP address from headers (Vercel sets x-forwarded-for)
  const forwardedFor = request.headers.get("x-forwarded-for")
  const ip = forwardedFor?.split(",")[0] || "unknown"
  
  // Could also use user ID if authenticated
  return ip
}
