"use server";

import { wizardStore } from "@/store/wizardStore";
import { Database } from "@/types/supabase";
import { sendToQueue } from "@/utils/amqpClient";
import { createClient } from "@/utils/supabase/server";
// import { redirect } from "next/navigation";
// import convert from "heic-convert";
// import heic2any from "heic2any";

import { v4 as uuidv4 } from "uuid";

export async function sendProjectToQueue(id: number) {
  try {
    await sendToQueue(id);
  } catch (error) {
    console.error("Error sending project to queue", error);
  }
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
  console.log("Creating project...");
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
  console.log("Project created");
  return { id };

  // console.time("thumbnail");
  // await createThumbnail(id, formData.get("files") as File);
  // console.timeEnd("thumbnail");

  // console.time("upload");
  // await sendFiles(files as File[], id);
  // console.timeEnd("upload");

  // sendProjectToQueue(id);

  // redirect("/projects");
  // toast.success("Project sent to queue");
}

const _getLatestProject = async () => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("project")
      .select("id")
      .order("id", { ascending: false })
      .limit(1);
    if (error) {
      throw new Error(error.message);
    }
    return data[0].id;
  } catch (error) {
    console.error("Error: getLatestProject", error);
  }
};

export const createThumbnail = async (formData: FormData) => {
  const supabase = createClient();
  const file = formData.get("files") as File;
  try {
    const projectId = await _getLatestProject();
    if (!projectId) {
      throw new Error("Project not found");
    }

    const id = uuidv4();

    const ext = file.name.split(".").pop();

    const { data: _dataThumbnail, error: _errorThumbnail } =
      await supabase.storage.from("public-dev").upload(`${id}.${ext}`, file);
    if (_errorThumbnail) {
      throw new Error(_errorThumbnail.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("public-dev").getPublicUrl(id);

    await updateThumbnail(projectId, `${publicUrl}.${ext}`);
    // console.log("Thumbnail created" + `${publicUrl}.${ext}`);
    // return toast.info("Thumbnail created");
  } catch (error) {
    console.error("Error: thumbnail", error);
    // toast.error("Error: thumbnail");
  }
};

export const sendFile = async (formData: FormData) => {
  const supabase = createClient();
  const projectId = await _getLatestProject();
  const file = formData.get("files") as File;
  const { data: _dataStorage, error: _errorStorage } = await supabase.storage
    .from("viewer3d-dev")
    .upload(projectId + "/images/" + file.name, file, {
      upsert: true,
    });

  if (_errorStorage) {
    return console.log(_errorStorage); // return toast.error("Error: " + files[i].name);
  }

  // toast.info("File upload " + files[i].name);
  const up = [...wizardStore.progress];
  up.push(file.name);

  wizardStore.progress = up;
  console.log(wizardStore.progress);
  console.log("File upload " + file.name);
};

export const pSendFiles = async (formData: FormData) => {
  const supabase = createClient();
  const projectId = await _getLatestProject();
  // create promise all uploader
  const files = formData.getAll("files") as File[];
  return files.map((f) =>
    supabase.storage
      .from("viewer3d-dev")
      .upload(projectId + "/images/" + f.name, f, {
        upsert: true,
      })
  );
};

export const sendFiles = async (formData: FormData) => {
  const supabase = createClient();
  const projectId = await _getLatestProject();
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
