import { describe, it, expect } from "vitest";
import { projectSchema, fileSchema, filesSchema } from "@/lib/validations/project";

describe("projectSchema", () => {
  it("validates correct project data", () => {
    const result = projectSchema.safeParse({
      name: "Test Project",
      description: "A description",
      detail: "reduced",
      order: "sequential",
      feature: "normal",
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty description", () => {
    const result = projectSchema.safeParse({
      name: "Test",
      description: "",
      detail: "reduced",
      order: "sequential",
      feature: "normal",
    });
    expect(result.success).toBe(true);
  });

  it("accepts missing description", () => {
    const result = projectSchema.safeParse({
      name: "Test",
      detail: "reduced",
      order: "sequential",
      feature: "normal",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = projectSchema.safeParse({
      name: "",
      detail: "reduced",
      order: "sequential",
      feature: "normal",
    });
    expect(result.success).toBe(false);
  });

  it("rejects name over 100 characters", () => {
    const result = projectSchema.safeParse({
      name: "a".repeat(101),
      detail: "reduced",
      order: "sequential",
      feature: "normal",
    });
    expect(result.success).toBe(false);
  });

  it("rejects description over 500 characters", () => {
    const result = projectSchema.safeParse({
      name: "Test",
      description: "a".repeat(501),
      detail: "reduced",
      order: "sequential",
      feature: "normal",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid detail value", () => {
    const result = projectSchema.safeParse({
      name: "Test",
      detail: "invalid",
      order: "sequential",
      feature: "normal",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid order value", () => {
    const result = projectSchema.safeParse({
      name: "Test",
      detail: "reduced",
      order: "invalid",
      feature: "normal",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid feature value", () => {
    const result = projectSchema.safeParse({
      name: "Test",
      detail: "reduced",
      order: "sequential",
      feature: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("accepts all valid detail values", () => {
    for (const detail of ["preview", "reduced", "medium", "full", "raw"]) {
      const result = projectSchema.safeParse({
        name: "Test",
        detail,
        order: "sequential",
        feature: "normal",
      });
      expect(result.success).toBe(true);
    }
  });
});

describe("fileSchema", () => {
  it("rejects non-File values", () => {
    const result = fileSchema.safeParse("not a file");
    expect(result.success).toBe(false);
  });
});

describe("filesSchema", () => {
  it("rejects empty array", () => {
    const result = filesSchema.safeParse([]);
    expect(result.success).toBe(false);
  });
});
