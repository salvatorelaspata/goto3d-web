"use client";
import { useStore, wizardStore } from "@/store/wizardStore";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import {
  createThumbnail,
  doCreate,
  sendFile,
  sendFiles,
  sendProjectToQueue,
} from "@/app/projects/new/actions";
import { useEffect, useTransition } from "react";
import { actions } from "@/store/main";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";
import { subscribe } from "valtio";

export const Wizard: React.FC = () => {
  const { currentStep } = useStore();

  let [isPending, startTransition] = useTransition();

  useEffect(() => {
    const unsubscribe = subscribe(wizardStore, () => {
      if (wizardStore.progress.length > 0) {
        console.log("ennamoooo" + wizardStore.progress.length);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isPending) return;
  }, [isPending]);

  const onSubmit = async (formData: FormData) => {
    // RUN SOME VALIDATION HERE
    actions.showLoading();

    startTransition(async () => {
      try {
        toast.info("Creazione progetto in corso...");
        // 1. create project
        console.log("Creating project...");
        const { id } = await doCreate(formData);
        console.log("Project created");

        toast.success(`${id}`);
        // 2. create thumbnail
        await createThumbnail(formData);
        toast.info("Thumbnail creato con successo");
        // 3. upload files
        console.time("upload");
        // await sendFiles(formData.getAll("files") as File[], id);
        const files = formData.getAll("files") as File[];
        // const pAll = files.map((f) => sendFile(formData));
        // await Promise.all(pAll);
        for (let i = 0; i < files.length; i++) {
          try {
            await sendFile(formData);
            // remove file from form data
            formData.delete(files[i].name);
            toast.info(`File ${files[i].name} caricato con successo`);
          } catch (error: any) {
            throw new Error(error.message);
          }
        }
        console.timeEnd("upload");
        toast.success("File caricati con successo");
        // 4. send project to queue
        await sendProjectToQueue(id);
        toast.success("Progetto inviato alla coda");

        toast.success("Progetto creato con successo");
      } catch (error: any) {
        actions.hideLoading();
        toast.error(error.message);
        return;
      }
      actions.hideLoading();
      redirect("/projects");
    });
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
