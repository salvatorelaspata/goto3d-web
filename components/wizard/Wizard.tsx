"use client";
import { useStore } from "@/store/wizardStore";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import {
  createThumbnail,
  doCreate,
  pSendFiles,
  sendProjectToQueue,
} from "@/app/projects/new/actions";
import { useEffect, useTransition } from "react";
import { actions } from "@/store/main";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

export const Wizard: React.FC = () => {
  const { currentStep } = useStore();
  let [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isPending) return;
  }, [isPending]);

  const onSubmit = async (formData: FormData) => {
    // RUN SOME VALIDATION HERE
    actions.showLoading();

    startTransition(async () => {
      try {
        // 1. create project
        console.log("Creating project...");
        const id = await doCreate(formData);
        console.log("Project createdd: ", id);
        formData.set("id", id.toString());
        console.log("Project created: ", formData.get("id"));
        toast.success(`Project created: ${id}`);
        // 2. create thumbnail
        console.log("Creating thumbnail...");
        console.log("Creating thumbnail: ");
        await createThumbnail(formData);
        console.log("Thumbnail created");
        toast.success("Thumbnail creato con successo");
        // 3. upload files
        toast.info("Caricamento di tutti file in corso...");
        console.log("Uploading files...");
        await Promise.all(await pSendFiles(formData));
        console.log("Files uploaded");
        toast.success("File caricati con successo");
        // 4. send project to queue
        console.log("Sending project to queue...");
        await sendProjectToQueue(id);
        console.log("Project sent to queue");
        toast.success("Progetto inviato alla coda");
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
