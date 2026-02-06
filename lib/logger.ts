/**
 * Structured JSON logger with correlation ID support.
 * Replaces raw console.log/error/warn in API routes.
 */

export type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  requestId?: string;
  [key: string]: unknown;
}

/** Generate a short correlation ID for request tracing */
export function generateRequestId(): string {
  return crypto.randomUUID().slice(0, 8);
}

function emit(entry: LogEntry) {
  const output = {
    timestamp: new Date().toISOString(),
    ...entry,
  };

  switch (entry.level) {
    case "error":
      console.error(JSON.stringify(output));
      break;
    case "warn":
      console.warn(JSON.stringify(output));
      break;
    default:
      console.log(JSON.stringify(output));
  }
}

/**
 * Create a scoped logger bound to a specific request.
 * Usage:
 *   const log = createLogger("contact-api", requestId);
 *   log.info("Processing form", { email: "***" });
 */
export function createLogger(scope: string, requestId?: string) {
  const base = { scope, requestId };

  return {
    info(message: string, data?: Record<string, unknown>) {
      emit({ level: "info", message, ...base, ...data });
    },
    warn(message: string, data?: Record<string, unknown>) {
      emit({ level: "warn", message, ...base, ...data });
    },
    error(message: string, data?: Record<string, unknown>) {
      emit({ level: "error", message, ...base, ...data });
    },
  };
}
