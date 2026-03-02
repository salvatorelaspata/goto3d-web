import {
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl as signUrl } from "@aws-sdk/s3-request-presigner";
import { clientS3 } from "./client";
import { SIGNED_URL_EXPIRY_SECONDS } from "@/lib/constants";

export const listObjects = async (Bucket: string, path: string) => {
  const response = await clientS3.send(
    new ListObjectsV2Command({
      Bucket,
      Prefix: path || undefined,
    }),
  );
  return response.Contents ?? [];
};

export const getObject = async (Bucket: string, Key: string) => {
  const response = await clientS3.send(new GetObjectCommand({ Bucket, Key }));
  return response.Body;
};

export const putObject = async (
  Bucket: string,
  Key: string,
  Body: Uint8Array,
) => {
  const response = await clientS3.send(
    new PutObjectCommand({ Bucket, Key, Body }),
  );
  return response;
};

export const getSignedUrl = async (Bucket: string, Key: string) => {
  const signedUrl = await signUrl(
    clientS3,
    new GetObjectCommand({ Bucket, Key }),
    { expiresIn: SIGNED_URL_EXPIRY_SECONDS },
  );
  return signedUrl;
};

export const deleteObject = async (Bucket: string, Key: string) => {
  try {
    const response = await clientS3.send(
      new DeleteObjectCommand({ Bucket, Key }),
    );
    return response;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[s3][api] - deleteObject Error:", error);
    }
    throw error;
  }
};
