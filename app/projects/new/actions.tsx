"use server";

import type { Database } from "@/types/supabase";
import { sendToQueue } from "@/utils/amqpClient";
import { putObject } from "@/utils/s3/api";
import { createClient } from "@/utils/supabase/server";

import { v4 as uuidv4 } from "uuid";

import dotenv from "dotenv";
import { revalidatePath } from "next/cache";
dotenv.config();

type detail = Database["public"]["Enums"]["details"];
type order = Database["public"]["Enums"]["orders"];
type feature = Database["public"]["Enums"]["features"];


export async function processProject(formData: FormData) {
  const supabase = createClient();

  const files = formData.getAll("files") as File[];
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const detail = formData.get("detail") as detail;
  const order = formData.get("order") as order;
  const feature = formData.get("feature") as feature;

  const filesArray = Array.from(files).map((f) => f.name) as string[];
  // creo il progetto su supabase
  const { data, error: projectError } = await supabase
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

  if (projectError) throw new Error(projectError.message);
  console.log('Project created', data);
  // prendo l'id del progetto
  const projectId = data.id
  console.log("projectId", projectId);
  // creo la thumbnail (la prima immagine, la converto se è heic)
  let file = files[0];
  console.log(file.type);
  if (file.type === "image/heic") {
    file = await _convertHeicToJpg(file);
  }
  console.log(file.type)
  // creo uuid
  const uuid = uuidv4();
  const ext = file.name.split(".").pop();
  const buffer = await file.arrayBuffer();
  const reader = new Uint8Array(buffer);
  await putObject(
    process.env.NEXT_CLOUDFLARE_R2_BUCKET_PUBLIC_NAME ?? "",
    `${uuid}.${ext}`,
    reader,
  );
  console.log('Thumbnail created', uuid);

  // aggiorno la thumbnail del progetto
  const { error: errorThumbnail } = await supabase
    .from("project")
    .update({ thumbnail: `${uuid}.${ext}` })
    .eq("id", projectId);

  if (errorThumbnail) {
    throw new Error(errorThumbnail.message);
  }
  console.log('Thumbnail updated', `${uuid}.${ext}`);

  // carico tutte le immagini su s3
  for (const image of files) {
    await putObject(process.env.NEXT_CLOUDFLARE_R2_BUCKET_NAME ?? "",
      projectId.toString() + "/images/" + image.name,
      reader
    );
    console.log('Image uploaded', image.name);
  }

  // invio il progetto alla coda
  await sendToQueue(projectId);
  console.log('Project sent to queue', projectId);

  // aggiorno la cache
  revalidatePath('/projects')
}

const _convertHeicToJpg = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    "https://heic_to_jpg.salvatorelaspata.dev/convert",
    {
      method: "POST",
      body: formData,
    },
  );
  console.log('Converting heic to jpg');
  if (!response.ok) throw new Error("Error converting heic to jpg");
  // return the file type File
  const blob = await response.blob();
  const filename = file.name.toLowerCase().replace("heic", "jpg");
  return new File([blob], filename, { type: "image/jpeg" });
};
