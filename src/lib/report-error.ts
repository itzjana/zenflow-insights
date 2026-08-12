type ErrorContext = Record<string, unknown>;

/**
 * Single funnel for errors caught by React error boundaries.
 *
 * Logs to the console today. Wire a monitoring service (Sentry, Bugsnag, …) in here
 * when one is provisioned so every boundary reports through one place.
 */
export function reportError(error: unknown, context: ErrorContext = {}) {
  if (typeof window === "undefined") return;

  const details = {
    route: window.location.pathname,
    ...context,
  };

  if (import.meta.env.DEV) {
    console.error("[error boundary]", error, details);
    return;
  }

  // Keep production noise minimal but preserve the stack for support requests.
  console.error(error instanceof Error ? error.message : error, details);
}
