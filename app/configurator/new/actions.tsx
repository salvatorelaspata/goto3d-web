"use server";

import { Database } from "@/types/supabase";
import { sendToQueue } from "@/utils/amqpClient";
import { createClient } from "@/utils/supabase/server";
// import { redirect } from "next/navigation";
// import convert from "heic-convert";
// import heic2any from "heic2any";

import { v4 as uuidv4 } from "uuid";

export async function sendProjectToQueue(id: number) {
  sendToQueue(id);
}

export async function createProject({
  name,
  description,
  detail,
  order,
  feature,
  files,
}: {
  name: string;
  description: string;
  detail: Database["public"]["Enums"]["details"];
  order: Database["public"]["Enums"]["orders"];
  feature: Database["public"]["Enums"]["features"];
  files: Database["public"]["Tables"]["project"]["Row"]["files"];
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("project")
    .insert({
      name,
      description,
      detail,
      order,
      feature,
      files,
      status: "in queue",
    })
    .select("id")
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
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
  const detail = formData.get(
    "detail"
  ) as Database["public"]["Enums"]["details"];
  const order = formData.get("order") as Database["public"]["Enums"]["orders"];
  const feature = formData.get(
    "feature"
  ) as Database["public"]["Enums"]["features"];

  const filesArray = Array.from(files).map((f) => f.name) as string[];

  const { id } = await createProject({
    name,
    description,
    detail,
    order,
    feature,
    files: filesArray,
  });

  console.time("thumbnail");
  await _createThumbnail(id, formData.get("files") as File);
  console.timeEnd("thumbnail");

  console.time("upload");
  await _sendFile(files as File[], id);
  console.timeEnd("upload");

  sendProjectToQueue(id);

  // redirect("/projects");
  // toast.success("Project sent to queue");
}

const _createThumbnail = async (projectId: number, file: File) => {
  const supabase = createClient();
  // console.log("Creating thumbnail" + file.name);
  // convert heic to jpg;
  try {
    // if (file.type === "image/heic") {
    //   const buffer = Buffer.from(await file.arrayBuffer());
    //   const outputBuffer = await convert({
    //     buffer: buffer, // the HEIC file buffer
    //     format: "PNG", // output format
    //   });

    //   file = new File([outputBuffer], "file.jpg", {
    //     type: "image/jpg",
    //   });
    // }

    const id = uuidv4();

    // if (file.type === "image/heic") {
    //   const t = await heic2any({
    //     blob: file,
    //     toType: "image/jpeg",
    //     quality: 0.5,
    //   });
    //   file = new File(t, `${id}.jpeg`, {
    //     type: "image/jpg",
    //   });
    // }
    const ext = file.name.split(".").pop();

    const { data: _dataThumbnail, error: _errorThumbnail } =
      await supabase.storage.from("public-dev").upload(`${id}.${ext}`, file);
    if (_errorThumbnail) {
      console.error(_errorThumbnail);
      // return toast.error(
      //   "Error: thumbnail" + JSON.stringify(_errorThumbnail, null, 2)
      // );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("public-dev").getPublicUrl(id);

    await updateThumbnail(projectId, `${publicUrl}.${ext}`);
    // console.log("Thumbnail created" + `${publicUrl}.${ext}`);
    // return toast.info("Thumbnail created");
  } catch (error) {
    console.error("Error creating thumbnail", error);
    // toast.error("Error: thumbnail");
  }
};

const _sendFile = async (files: File[], projectId: number) => {
  const supabase = createClient();
  // upload file in supabase storage
  // eseguo sequenzialmente l'upload per dare evidenza all'utente del caricamento
  let percentage = 0;
  if (!files || files.length === 0) return;
  for (let i = 0; i < files.length; i++) {
    const { data: _dataStorage, error: _errorStorage } = await supabase.storage
      .from("viewer3d-dev")
      .upload(projectId + "/images/" + files[i].name, files[i], {
        upsert: true,
      });

    percentage = ((i + 1) / files.length) * 100;

    if (_errorStorage) {
      return console.log(_errorStorage); // return toast.error("Error: " + files[i].name);
    }

    // toast.info("File upload " + files[i].name);
    console.log("File upload " + files[i].name);
  }
};
