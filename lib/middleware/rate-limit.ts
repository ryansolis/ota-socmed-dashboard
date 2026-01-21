/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or a dedicated rate limiting service
 */

type RateLimitStore = {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, maxRequests } = options

  return (identifier: string): { allowed: boolean; remaining: number; resetTime: number } => {
    const now = Date.now()
    const key = identifier

    // Clean up expired entries periodically (simple cleanup)
    if (Math.random() < 0.01) {
      // 1% chance to clean up
      Object.keys(store).forEach((k) => {
        if (store[k].resetTime < now) {
          delete store[k]
        }
      })
    }

    const record = store[key]

    if (!record || record.resetTime < now) {
      // Create new record or reset expired one
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      }
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs,
      }
    }

    if (record.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
      }
    }

    record.count++
    return {
      allowed: true,
      remaining: maxRequests - record.count,
      resetTime: record.resetTime,
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
