"use client";
// import { actions } from "@/store/main";
// import { actions as wizardAction } from "@/store/wizardStore";
// import { useStore } from "@/store/wizardStore";
import { useStore as useMainStore } from "@/store/main";
// import { createClient } from "@/utils/supabase/client";
// import { toast } from "react-toastify";
// import {
//   sendProjectToQueue,
//   createProject,
//   updateThumbnail,
// } from "@/app/projects/new/actions";
// import { useRouter } from "next/navigation";
// import { v4 as uuidv4 } from "uuid";
// import convert from "heic-convert/browser";

export default function CompleteButton() {
  // const { name, description, files, detail, order, feature } = useStore();
  const { loading } = useMainStore();
  // const supabase = createClient();
  // const navigation = useRouter();
  // const onSubmit = async () => {
  //   actions.showLoading();
  //   const filesArray = Array.from(files).map((f) => f.name);
  //   const { id } = await createProject({
  //     name,
  //     description,
  //     detail,
  //     order,
  //     feature,
  //     files: filesArray,
  //   });

  //   toast.success("Project created");

  //   console.time("thumbnail");
  //   await _createThumbnail(id, files[0]);
  //   console.timeEnd("thumbnail");

  //   console.time("upload");
  //   await _sendFile(files as FileList, id);
  //   console.timeEnd("upload");

  //   sendProjectToQueue(id);
  //   toast.success("Project sent to queue");
  //   actions.hideLoading();

  //   wizardAction.resetState();

  //   navigation.push("/projects");
  // };

  // const _createThumbnail = async (projectId: number, file: File) => {
  //   // convert heic to jpg;
  //   try {
  //     // if (file.type === "image/heic") {
  //     //   const outputBuffer = await convert({
  //     //     buffer: file, // the HEIC file buffer
  //     //     format: "PNG", // output format
  //     //   });

  //     //   file = new File([outputBuffer], "file.jpg", {
  //     //     type: "image/jpg",
  //     //   });
  //     // }
  //     const id = uuidv4();
  //     const ext = file.name.split(".").pop();

  //     const { data: _dataThumbnail, error: _errorThumbnail } =
  //       await supabase.storage.from("public-dev").upload(`${id}.${ext}`, file);
  //     if (_errorThumbnail)
  //       return toast.error(
  //         "Error: thumbnail" + JSON.stringify(_errorThumbnail, null, 2)
  //       );

  //     const {
  //       data: { publicUrl },
  //     } = supabase.storage.from("public-dev").getPublicUrl(id);

  //     await updateThumbnail(projectId, `${publicUrl}.${ext}`);
  //     return toast.info("Thumbnail created");
  //   } catch (error) {
  //     console.error("Error creating thumbnail", error);
  //     toast.error("Error: thumbnail");
  //   }
  // };

  // const _sendFile = async (files: FileList, projectId: number) => {
  //   // upload file in supabase storage
  //   // eseguo sequenzialmente l'upload per dare evidenza all'utente del caricamento
  //   let percentage = 0;
  //   if (!files || files.length === 0) return;
  //   for (let i = 0; i < files.length; i++) {
  //     const { data: _dataStorage, error: _errorStorage } =
  //       await supabase.storage
  //         .from("viewer3d-dev")
  //         .upload(projectId + "/images/" + files[i].name, files[i], {
  //           upsert: true,
  //         });

  //     percentage = ((i + 1) / files.length) * 100;

  //     if (_errorStorage) return toast.error("Error: " + files[i].name);

  //     toast.info("File upload " + files[i].name);
  //   }
  // };

  return (
    <button
      className="border-green-600 border-2 text-white p-5 rounded-md text-xl font-bold hover:bg-palette5 focus:outline-none focus:ring-2 focus:ring-palette1 focus:ring-offset-2 focus:ring-offset-palette1"
      // onClick={onSubmit}
      type="submit"
      disabled={loading}
    >
      Processa {"✅"}
    </button>
  );
}
