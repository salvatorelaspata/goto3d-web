import { describe, it, expect } from "vitest";
import { catalogSchema } from "@/lib/validations/catalog";

describe("catalogSchema", () => {
  it("validates correct catalog data", () => {
    const result = catalogSchema.safeParse({
      title: "My Catalog",
      description: "A nice catalog",
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty description", () => {
    const result = catalogSchema.safeParse({
      title: "My Catalog",
      description: "",
    });
    expect(result.success).toBe(true);
  });

  it("accepts missing description", () => {
    const result = catalogSchema.safeParse({
      title: "My Catalog",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = catalogSchema.safeParse({
      title: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects title over 100 characters", () => {
    const result = catalogSchema.safeParse({
      title: "a".repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it("rejects description over 500 characters", () => {
    const result = catalogSchema.safeParse({
      title: "My Catalog",
      description: "a".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("accepts visibility values", () => {
    const result = catalogSchema.safeParse({
      title: "My Catalog",
      visibility: "true",
    });
    expect(result.success).toBe(true);
  });
});
