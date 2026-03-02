import { describe, it, expect } from "vitest";
import {
  MAX_FILE_SIZE,
  MAX_FILES_PER_PROJECT,
  ALLOWED_MIME_TYPES,
  PROJECT_STATUS,
  SIGNED_URL_EXPIRY_SECONDS,
} from "@/lib/constants";

describe("constants", () => {
  it("MAX_FILE_SIZE is 10MB", () => {
    expect(MAX_FILE_SIZE).toBe(10 * 1024 * 1024);
  });

  it("MAX_FILES_PER_PROJECT is 20", () => {
    expect(MAX_FILES_PER_PROJECT).toBe(20);
  });

  it("ALLOWED_MIME_TYPES includes standard image types", () => {
    expect(ALLOWED_MIME_TYPES).toContain("image/jpeg");
    expect(ALLOWED_MIME_TYPES).toContain("image/png");
    expect(ALLOWED_MIME_TYPES).toContain("image/webp");
  });

  it("PROJECT_STATUS has all expected values", () => {
    expect(PROJECT_STATUS.IN_QUEUE).toBe("in queue");
    expect(PROJECT_STATUS.PROCESSING).toBe("processing");
    expect(PROJECT_STATUS.DONE).toBe("done");
    expect(PROJECT_STATUS.ERROR).toBe("error");
  });

  it("SIGNED_URL_EXPIRY_SECONDS is 1 hour", () => {
    expect(SIGNED_URL_EXPIRY_SECONDS).toBe(3600);
  });
});
