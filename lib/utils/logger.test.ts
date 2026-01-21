import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { logger } from "./logger"

describe("logger", () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {}) as ReturnType<typeof vi.spyOn>
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {}) as ReturnType<typeof vi.spyOn>
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {}) as ReturnType<typeof vi.spyOn>
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("should log request messages", () => {
    logger.request("GET", "/api/test", 200, 150, { userId: "123" })

    expect(consoleLogSpy).toHaveBeenCalled()
    const call = consoleLogSpy.mock.calls[0]
    expect(call[0]).toMatch(/\[.*\] \[INFO\]/)
    expect(call[1]).toContain("API GET /api/test")
    expect(call[2]).toMatchObject({
      statusCode: 200,
      duration: "150ms",
      userId: "123",
    })
  })

  it("should log warn messages", () => {
    logger.warn("Test warning", { key: "value" })

    expect(consoleWarnSpy).toHaveBeenCalled()
    const call = consoleWarnSpy.mock.calls[0]
    expect(call[0]).toMatch(/\[.*\] \[WARN\]/)
    expect(call[1]).toContain("Test warning")
    expect(call[2]).toMatchObject({ key: "value" })
  })

  it("should log error messages", () => {
    logger.error("Test error", { error: "Something went wrong" })

    expect(consoleErrorSpy).toHaveBeenCalled()
    const call = consoleErrorSpy.mock.calls[0]
    expect(call[0]).toMatch(/\[.*\] \[ERROR\]/)
    expect(call[1]).toContain("Test error")
    expect(call[2]).toMatchObject({ error: "Something went wrong" })
  })

  it("should include metadata in logs", () => {
    logger.info("Test info", { customKey: "customValue" })

    expect(consoleLogSpy).toHaveBeenCalled()
    const call = consoleLogSpy.mock.calls[0]
    expect(call[0]).toMatch(/\[.*\] \[INFO\]/)
    expect(call[1]).toContain("Test info")
    expect(call[2]).toMatchObject({ customKey: "customValue" })
  })

  it("should log in JSON format in production", () => {
    // Mock NODE_ENV by temporarily replacing the property access
    const originalNodeEnv = process.env.NODE_ENV
    vi.stubEnv("NODE_ENV", "production")
    
    try {
      logger.info("Production log", { key: "value" })

      expect(consoleLogSpy).toHaveBeenCalled()
      const call = consoleLogSpy.mock.calls[0]
      expect(typeof call[0]).toBe("string")
      const logEntry = JSON.parse(call[0] as string)
      expect(logEntry.level).toBe("info")
      expect(logEntry.message).toBe("Production log")
      expect(logEntry.metadata).toMatchObject({ key: "value" })
    } finally {
      // Restore original NODE_ENV
      if (originalNodeEnv !== undefined) {
        vi.stubEnv("NODE_ENV", originalNodeEnv)
      } else {
        vi.unstubAllEnvs()
      }
    }
  })
})

