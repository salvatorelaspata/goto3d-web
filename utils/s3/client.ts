import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";

const {
  NEXT_CLOUDFLARE_R2_ACCOUNT_ID,
  NEXT_CLOUDFLARE_R2_ACCESS_KEY_ID,
  NEXT_CLOUDFLARE_R2_SECRET_ACCESS_KEY,
} = process.env;

const s3ClientConfig: S3ClientConfig = {
  region: "auto",
  endpoint: `https://${NEXT_CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: NEXT_CLOUDFLARE_R2_ACCESS_KEY_ID || "",
    secretAccessKey: NEXT_CLOUDFLARE_R2_SECRET_ACCESS_KEY || "",
  },
};

export const clientS3 = new S3Client(s3ClientConfig);
