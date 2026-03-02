import { describe, it, expect } from "vitest";
import { createRateLimiter } from "@/lib/rate-limit";

describe("createRateLimiter", () => {
  it("allows requests within limit", () => {
    const limiter = createRateLimiter({ maxRequests: 3, windowMs: 60000 });

    const result1 = limiter.limit("user1");
    expect(result1.success).toBe(true);
    expect(result1.remaining).toBe(2);

    const result2 = limiter.limit("user1");
    expect(result2.success).toBe(true);
    expect(result2.remaining).toBe(1);

    const result3 = limiter.limit("user1");
    expect(result3.success).toBe(true);
    expect(result3.remaining).toBe(0);
  });

  it("blocks requests over limit", () => {
    const limiter = createRateLimiter({ maxRequests: 2, windowMs: 60000 });

    limiter.limit("user1");
    limiter.limit("user1");

    const result = limiter.limit("user1");
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("tracks users independently", () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 60000 });

    const result1 = limiter.limit("user1");
    expect(result1.success).toBe(true);

    const result2 = limiter.limit("user2");
    expect(result2.success).toBe(true);

    const result3 = limiter.limit("user1");
    expect(result3.success).toBe(false);
  });

  it("resets after window expires", async () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 50 });

    limiter.limit("user1");
    const blocked = limiter.limit("user1");
    expect(blocked.success).toBe(false);

    await new Promise((r) => setTimeout(r, 60));

    const afterReset = limiter.limit("user1");
    expect(afterReset.success).toBe(true);
  });
});
