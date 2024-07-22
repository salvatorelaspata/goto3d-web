import {
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl as signUrl } from "@aws-sdk/s3-request-presigner";
import { clientS3 } from "./client";

export const listObjects = async (Bucket: string, path: string) => {
  const response = await clientS3.send(new ListObjectsV2Command({ Bucket }));

  if (!response.Contents) return [];
  if (!path) return response.Contents;
  const filtered = response.Contents.filter((c) => c?.Key?.startsWith(path));
  return filtered;
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
  console.log("getSignedUrl", Bucket, Key);
  const signedUrl = await signUrl(
    clientS3,
    new GetObjectCommand({ Bucket, Key }),
    { expiresIn: 3600 },
  );
  return signedUrl;
};

export const deleteObject = async (Bucket: string, Key: string) => {
  const response = await clientS3.send(
    new DeleteObjectCommand({ Bucket, Key }),
  );
  return response;
};
