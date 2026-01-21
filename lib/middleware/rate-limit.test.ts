import { describe, it, expect, vi, beforeEach } from "vitest"
import { getRateLimitIdentifier } from "./rate-limit"

describe("getRateLimitIdentifier", () => {
  it("should extract IP from x-forwarded-for header", () => {
    const request = new Request("http://example.com", {
      headers: {
        "x-forwarded-for": "192.168.1.1, 10.0.0.1",
      },
    })

    const identifier = getRateLimitIdentifier(request)
    expect(identifier).toBe("192.168.1.1")
  })

  it("should handle single IP in x-forwarded-for", () => {
    const request = new Request("http://example.com", {
      headers: {
        "x-forwarded-for": "192.168.1.1",
      },
    })

    const identifier = getRateLimitIdentifier(request)
    expect(identifier).toBe("192.168.1.1")
  })

  it("should return 'unknown' when x-forwarded-for is missing", () => {
    const request = new Request("http://example.com")

    const identifier = getRateLimitIdentifier(request)
    expect(identifier).toBe("unknown")
  })

  it("should handle empty x-forwarded-for header", () => {
    const request = new Request("http://example.com", {
      headers: {
        "x-forwarded-for": "",
      },
    })

    const identifier = getRateLimitIdentifier(request)
    expect(identifier).toBe("unknown")
  })
})

// Note: Testing the actual rateLimit function would require mocking Redis
// which is more complex. In a real scenario, you'd use a test Redis instance
// or mock the Redis client.

