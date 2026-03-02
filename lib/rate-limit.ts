type RateLimitEntry = {
  count: number;
  resetAt: number;
};

interface RateLimiterOptions {
  /** Max requests allowed in the window */
  maxRequests: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

/**
 * In-memory rate limiter (per-process, resets on restart).
 * For production with multiple instances, replace with Upstash Redis.
 */
export function createRateLimiter({ maxRequests, windowMs }: RateLimiterOptions) {
  const requests = new Map<string, RateLimitEntry>();

  // Periodically clean up expired entries to prevent memory leaks
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    requests.forEach((entry, key) => {
      if (now >= entry.resetAt) {
        requests.delete(key);
      }
    });
  }, windowMs * 2);

  // Allow garbage collection in serverless environments
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return {
    /**
     * Check if a request from the given identifier should be allowed.
     * @returns { success: true } if allowed, { success: false } if rate limited
     */
    limit(identifier: string): { success: boolean; remaining: number } {
      const now = Date.now();
      const entry = requests.get(identifier);

      if (!entry || now >= entry.resetAt) {
        requests.set(identifier, { count: 1, resetAt: now + windowMs });
        return { success: true, remaining: maxRequests - 1 };
      }

      if (entry.count >= maxRequests) {
        return { success: false, remaining: 0 };
      }

      entry.count++;
      return { success: true, remaining: maxRequests - entry.count };
    },
  };
}

/** Rate limiter for general API requests: 10 req/min per user */
export const rateLimiter = createRateLimiter({
  maxRequests: 10,
  windowMs: 60_000,
});

/** Rate limiter for file uploads: 5 req/min per user */
export const uploadRateLimiter = createRateLimiter({
  maxRequests: 5,
  windowMs: 60_000,
});
