// File Limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES_PER_PROJECT = 20;

// Allowed MIME types for image upload
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

// Project Status
export const PROJECT_STATUS = {
  IN_QUEUE: "in queue",
  PROCESSING: "processing",
  DONE: "done",
  ERROR: "error",
} as const;

export type ProjectStatus = (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];

// Signed URL
export const SIGNED_URL_EXPIRY_SECONDS = 3600; // 1 hour
