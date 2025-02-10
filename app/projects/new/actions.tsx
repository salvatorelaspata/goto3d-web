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
  console.log("id", id);
  const { data, error } = await supabase
    .from("project")
    .update({
      thumbnail: thumbnail,
    })
    .eq("id", id);
  console.log("data", data);
  console.log("error", error);
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
}: {
  file: File;
  projectId: string;
}) => {
  let id = uuidv4();
  console.log("projectId", projectId);
  if (!projectId) throw new Error("Project not found");

  try {
    console.log("file.name", file.name);
    const ext = file.name.split(".").pop();
    console.log("ext", ext);  
    const buffer = await file.arrayBuffer();
    console.log("buffer", buffer);
    const reader = new Uint8Array(buffer);
    console.log("reader", reader);

    await putObject("public-dev", `${id}.${ext}`, reader);
    // console.log("upload", upload);
    // if (!upload) throw new Error("Error uploading file");

    await updateThumbnail(parseInt(projectId), `${id}.${ext}`);
  } catch (error) {
    console.error("Error: thumbnail", error);
  }
};

export const _convertHeicToJpg = async (file: File) => {
    // create form data with the first file as thumbnail and convert it to jpg
  // curl --request POST \
  // --url https://heic_to_jpg.salvatorelaspata.dev/convert \
  // --header 'content-type: multipart/form-data' \
  // --form file=@/Users/salvatorelaspata/Pictures/Natale3d/IMG_6075.HEIC

  const formData = new FormData();
  formData.append("file", file);

  console.log("formData", formData);

  const response = await fetch("https://heic_to_jpg.salvatorelaspata.dev/convert", {
    method: "POST",
    body: formData,
    // headers: {
    //   "Content-Type": "multipart/form-data",
    // },
  });
  console.log("response", response);
  if (!response.ok) throw new Error("Error converting heic to jpg");
  // return the file type File
  const blob = await response.blob();
  return new File([blob], file.name, { type: "image/jpeg" });
};

export const createThumbnail = async (formData: FormData) => {
  try {
    const projectId = formData.get("id") as string;
    const files = formData.getAll("files") as File[];
    const file = files[0];

    if (!file) {
      throw new Error("No file provided for thumbnail");
    }

    let jpgFile: File | null = null;
    // check if the file is a heic file
    if (file.type === "image/heic") { 
      // throw new Error("File is not a heic file");
      jpgFile =await _convertHeicToJpg(file);
    } else {
      jpgFile = file;
    }

    // convert the file to jpg 
    
    if (!jpgFile) {
      throw new Error("Failed to convert HEIC to JPG");
    }

    await putThumbnail({
      file: jpgFile,
      projectId: projectId,
    });

    return true;
  } catch (error) {
    console.error("Error in createThumbnail:", error);
    throw error;
  }
};

export const pSendFile = async (formData: FormData) => {
  const projectId = formData.get("id") as string;
  const file = formData.get("file") as File;
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
