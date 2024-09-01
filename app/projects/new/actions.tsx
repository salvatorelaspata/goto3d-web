"use server";

import type { Database } from "@/types/supabase";
import { sendToQueue } from "@/utils/amqpClient";
import { putObject } from "@/utils/s3/api";
import { createClient } from "@/utils/supabase/server";

import { v4 as uuidv4 } from "uuid";

type detail = Database["public"]["Enums"]["details"];
type order = Database["public"]["Enums"]["orders"];
type feature = Database["public"]["Enums"]["features"];

export async function sendProjectToQueue(id: number) {
  try {
    await sendToQueue(id);
  } catch (error) {
    console.error("Error sending project to queue", error);
  }
}

export async function updateThumbnail(id: number, thumbnail: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("project")
    .update({
      thumbnail: thumbnail,
    })
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function doCreate(formData: FormData) {
  const files = formData.getAll("files") as File[];
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const detail = formData.get("detail") as detail;
  const order = formData.get("order") as order;
  const feature = formData.get("feature") as feature;

  const filesArray = Array.from(files).map((f) => f.name) as string[];

  const supabase = createClient();
  const { data, error } = await supabase
    .from("project")
    .insert({
      name,
      description,
      detail,
      order,
      feature,
      files: filesArray,
      status: "in queue",
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  return data?.id;
}

export const putThumbnail = async ({
  file,
  projectId,
  thumbnail,
}: {
  file: File;
  projectId: string;
  thumbnail?: string;
}) => {
  console.log("projectId", projectId, "thumbnail", thumbnail);
  let id = uuidv4();
  if (thumbnail) {
    id = thumbnail.split(".")[0];
  }
  if (!projectId) throw new Error("Project not found");

  try {
    const ext = file.name.split(".").pop();

    const buffer = await file.arrayBuffer();
    const reader = new Uint8Array(buffer);

    const upload = await putObject("public-dev", `${id}.${ext}`, reader);

    if (!upload) throw new Error("Error uploading file");

    await updateThumbnail(parseInt(projectId), `${id}.${ext}`);
  } catch (error) {
    console.error("Error: thumbnail", error);
  }
};

// deprecated
export const createThumbnail = async (formData: FormData) => {
  const file = formData.get("thumbnail") as File;
  const projectId = formData.get("id") as string;
  const id = uuidv4();

  if (!projectId) throw new Error("Project not found");

  try {
    const ext = file.name.split(".").pop();

    const buffer = await file.arrayBuffer();
    const reader = new Uint8Array(buffer);

    const upload = await putObject("public-dev", `${id}.${ext}`, reader);

    if (!upload) throw new Error("Error uploading file");

    await updateThumbnail(parseInt(projectId), `${id}.${ext}`);
  } catch (error) {
    console.error("Error: thumbnail", error);
  }
};

export const pSendFile = async (projectId: string, file: File) => {
  const buffer = await file.arrayBuffer();
  const reader = new Uint8Array(buffer);
  return putObject("dev", projectId + "/images/" + file.name, reader);
};

export const pSendFiles = async (formData: FormData) => {
  // const supabase = createClient();
  const projectId = formData.get("id") as string;
  const files = formData.getAll("files") as File[];
  return files.map(async (f) => {
    const buffer = await f.arrayBuffer();
    const reader = new Uint8Array(buffer);
    return putObject("dev", projectId + "/images/" + f.name, reader);
  });
};
