"use server";

import { actions } from "@/store/main";
import { sendToQueue } from "@/utils/amqpClient";
import { createClient } from "@/utils/supabase/server";
import { toast } from "react-toastify";

export default async function createProject(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const file_location = formData.get("file_location") as string;
  const files = formData.get("files");
  const detail = formData.get("detail") as string;
  const order = formData.get("order") as string;
  const feature = formData.get("feature") as string;

  const project_id = await createProjectOnSupabase({ name, description });
  const process_id = await createProcessOnSupabase({
    detail,
    order,
    feature,
    project_id,
  });
  await uploadFilesToSupabase(files, file_location, project_id);
  await sendToQueueForPreview(project_id);
}

async function createProjectOnSupabase({ name, description }) {
  console.log("createProjectOnSupabase");
  const supabase = createClient();
  actions.showLoading();
  const ts = new Date().getTime();
  const file_location = "test/" + ts + "/";
  const { data: _dataProject, error: _errorProject } = await supabase
    .from("Project")
    .insert({
      name,
      description,
      status: "draft",
      catalog_id: null,
      file_location,
    })
    .select("id")
    .single();
  if (_errorProject) {
    console.log("_errorProject", _errorProject);
    actions.hideLoading();
    return;
  }
  return _dataProject.id;
}

async function createProcessOnSupabase({ detail, order, feature, project_id }) {
  console.log("createProcessOnSupabase");
  const supabase = createClient();
  const { data: _dataProcess, error: _errorProcess } = await supabase
    .from("Process")
    .insert({
      project_id: project_id,
      status: "draft",
      detail,
      order,
      feature,
    })
    .select("id")
    .single();
  if (_errorProcess) {
    console.log("_errorProcess", _errorProcess);
    actions.hideLoading();
    return;
  }
  toast.success("Process created");
}

async function uploadFilesToSupabase(
  files: FileList,
  fileLocation: string,
  project_id: number
) {
  console.time("upload");
  await _sendFile(files, fileLocation, project_id);
  console.timeEnd("upload");
}

const _sendFile = async (
  files: FileList,
  file_location: string,
  project_id: number
) => {
  const supabase = createClient();
  // upload file in supabase storage
  // eseguo sequenzialmente l'upload per dare evidenza all'utente del caricamento
  let percentage = 0;
  if (!files || files.length === 0) return;
  for (let i = 0; i < files.length; i++) {
    const { data: _dataStorage, error: _errorStorage } = await supabase.storage
      .from("viewer3d-dev")
      .upload(file_location + "images/" + files[i].name, files[i], {
        upsert: true,
      });

    percentage = ((i + 1) / files.length) * 100;

    if (_errorStorage) return toast.error("Error: " + files[i].name);

    toast.info("File upload " + files[i].name);

    const { data: d, error: e } = await supabase.rpc("append_array", {
      id: project_id,
      new_element: files[i].name,
    });
    console.log({ d, e });
    console.log("_dataStorage", _dataStorage, percentage);
  }
};

async function sendToQueueForPreview(project_id: number) {
  sendToQueue(project_id);
}

async function sendToQueueForPublish(project_id: number) {
  sendToQueue(project_id);
}
