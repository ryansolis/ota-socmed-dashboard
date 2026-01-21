/**
 * Simple request logger
 * Logs requests with timestamps and metadata
 */

type LogLevel = "info" | "warn" | "error"

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  metadata?: Record<string, unknown>
}

class Logger {
  private log(level: LogLevel, message: string, metadata?: Record<string, unknown>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata,
    }

    // In production, you'd send this to a logging service
    // For now, we'll use console with structured format
    if (process.env.NODE_ENV === "production") {
      // In production, log as JSON for log aggregation services
      const logMethod = level === "error" ? console.error : level === "warn" ? console.warn : console.log
      logMethod(JSON.stringify(entry))
    } else {
      // In development, use formatted console logs
      const prefix = `[${entry.timestamp}] [${level.toUpperCase()}]`
      const logMethod = level === "error" ? console.error : level === "warn" ? console.warn : console.log
      if (metadata) {
        logMethod(prefix, message, metadata)
      } else {
        logMethod(prefix, message)
      }
    }
  }

  info(message: string, metadata?: Record<string, unknown>) {
    this.log("info", message, metadata)
  }

  warn(message: string, metadata?: Record<string, unknown>) {
    this.log("warn", message, metadata)
  }

  error(message: string, metadata?: Record<string, unknown>) {
    this.log("error", message, metadata)
  }

  /**
   * Log API request
   */
  request(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    metadata?: Record<string, unknown>
  ) {
    this.info(`API ${method} ${path}`, {
      statusCode,
      duration: `${duration}ms`,
      ...metadata,
    })
  }
}

export const logger = new Logger()
