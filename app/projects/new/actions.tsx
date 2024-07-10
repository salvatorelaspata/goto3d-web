"use server";

import type { Database } from "@/types/supabase";
import { sendToQueue } from "@/utils/amqpClient";
import { createClient } from "@/utils/supabase/server";

import { v4 as uuidv4 } from "uuid";

type detail = Database["public"]["Enums"]["details"];
type order = Database["public"]["Enums"]["orders"];
type feature = Database["public"]["Enums"]["features"];
type files = Database["public"]["Tables"]["project"]["Row"]["files"];

export async function sendProjectToQueue(id: number) {
  try {
    await sendToQueue(id);
  } catch (error) {
    console.error("Error sending project to queue", error);
  }
}

async function createProject({
  name,
  description,
  detail,
  order,
  feature,
  files,
}: {
  name: string;
  description: string;
  detail: detail;
  order: order;
  feature: feature;
  files: files;
}) {}

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

  const { id } = await createProject({
    name,
    description,
    detail,
    order,
    feature,
    files: filesArray,
  });

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

  if (error) {
    throw new Error(error.message);
  }
  return data?.id;
}

export const createThumbnail = async (formData: FormData) => {
  const supabase = createClient();
  const file = formData.get("files") as File;
  const projectId = formData.get("id") as string;
  const id = uuidv4();

  if (!projectId) throw new Error("Project not found");

  try {
    const ext = file.name.split(".").pop();
    const { error } = await supabase.storage
      .from("public-dev")
      .upload(`${id}.${ext}`, file);
    if (error) throw new Error(error.message);

    const {
      data: { publicUrl },
    } = supabase.storage.from("public-dev").getPublicUrl(id);

    await updateThumbnail(parseInt(projectId), `${publicUrl}.${ext}`);
  } catch (error) {
    console.error("Error: thumbnail", error);
  }
};

export const pSendFiles = async (formData: FormData) => {
  const supabase = createClient();
  const projectId = formData.get("id") as string;
  const files = formData.getAll("files") as File[];
  return files.map((f) =>
    supabase.storage
      .from("viewer3d-dev")
      .upload(projectId + "/images/" + f.name, f, {
        upsert: true,
      })
  );
};

// deprecated
export const sendFile = async (formData: FormData) => {
  const supabase = createClient();
  const projectId = formData.get("id") as string;
  const file = formData.get("files") as File;
  const { data: _dataStorage, error: _errorStorage } = await supabase.storage
    .from("viewer3d-dev")
    .upload(projectId + "/images/" + file.name, file, {
      upsert: true,
    });

  if (_errorStorage) {
    return console.log(_errorStorage);
  }
  console.log("File upload " + file.name);
};

// deprecated
export const sendFiles = async (formData: FormData) => {
  const supabase = createClient();
  const projectId = formData.get("id") as string;
  const files = formData.getAll("files") as File[];

  if (!files || files.length === 0) return;

  for (let i = 0; i < files.length; i++) {
    const { data: _dataStorage, error: _errorStorage } = await supabase.storage
      .from("viewer3d-dev")
      .upload(projectId + "/images/" + files[i].name, files[i], {
        upsert: true,
      });

    if (_errorStorage) {
      return console.log(_errorStorage); // return toast.error("Error: " + files[i].name);
    }
  }
};
