import { Redis } from "@upstash/redis"

/**
 * Redis client for rate limiting
 * Uses Upstash Redis which is serverless-friendly and works with Edge Functions
 */

let redisClient: Redis | null = null

export function getRedisClient(): Redis {
  if (redisClient) {
    return redisClient
  }

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    throw new Error(
      "Redis configuration missing. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables."
    )
  }

  redisClient = new Redis({
    url,
    token,
  })

  return redisClient
}

/**
 * Test Redis connection
 */
export async function testRedisConnection(): Promise<boolean> {
  try {
    const redis = getRedisClient()
    await redis.ping()
    return true
  } catch (error) {
    console.error("Redis connection test failed:", error)
    return false
  }
}

