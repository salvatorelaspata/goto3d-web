"use client";
import { useStore } from "@/store/wizardStore";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import {
  createThumbnail,
  // createThumbnail,
  doCreate,
  pSendFile,
  pSendFiles,
  putThumbnail,
  sendProjectToQueue,
} from "@/app/projects/new/actions";
// import { useEffect, useTransition } from "react";
import { actions } from "@/store/main";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";
// import { useRef, useState } from "react";

export const Wizard: React.FC = () => {
  const { currentStep } = useStore();

  const onSubmit = async (formData: FormData) => {
    actions.showLoading();
    try {
      // 1. create project
      const id = await doCreate(formData);
      formData.set("id", id.toString());
      toast.success(`Project created: ${id}`);
      // 2. create thumbnail
      // await initializeWorker(id);
      // await createThumbnail(formData);
      // await putThumbnail({
      //   file: formData.get("thumbnail") as File,
      //   projectId: id.toString(),
      // });
      // toast.success("Thumbnail creato con successo");
      // 3. upload files
      // toast.info("Caricamento di tutti file in corso...");
      // await Promise.all(await pSendFiles(formData));
      const files = formData.getAll("files") as File[];
      for (const file of files) {
        try {
          // create form data with current file
          const fileData = new FormData();
          fileData.append("id", id.toString());
          fileData.append("file", file);
          await pSendFile(fileData);
          toast.info(`File ${file.name} caricato con successo`);
        } catch (error) {
          toast.error(`Errore nel caricamento del file ${file.name}`);
          throw error;
        }
      }
      toast.success("File caricati con successo");
      // 4. send project to queue
      await sendProjectToQueue(id);
      toast.success("Progetto inviato alla coda");
    } catch (error: any) {
      actions.hideLoading();
      toast.error(error.message);
      return;
    }
    actions.hideLoading();
    redirect("/projects");
  };

  return (
    <form action={onSubmit}>
      <div className={currentStep === 1 ? "block" : "hidden"}>
        <Step1 />
      </div>
      <div className={currentStep === 2 ? "block" : "hidden"}>
        <Step2 />
      </div>
      <div className={currentStep === 3 ? "block" : "hidden"}>
        <Step3 />
      </div>
    </form>
  );
};
