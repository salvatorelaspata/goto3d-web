"use client";
import { useStore } from "@/store/wizardStore";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { actions } from "@/store/main";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createClient } from "@/utils/supabase/client";
import type { Database } from "@/types/supabase";

type detail = Database["public"]["Enums"]["details"];
type order = Database["public"]["Enums"]["orders"];
type feature = Database["public"]["Enums"]["features"];

const supabase = createClient();

export const Wizard: React.FC = () => {
  const { currentStep } = useStore();
  const router = useRouter();

  const onSubmit = async (formData: FormData) => {
    actions.showLoading();
    try {
      toast.info("Creazione progetto in corso");
      const session = await supabase.auth.getSession();
      console.log(session)
      const token = session.data.session?.access_token;
      console.log(token)
      const headers = { 'Authorization': `Bearer ${token}` }
      const name = formData.get("name") as string;
      const description = formData.get("description") as string;
      const detail = formData.get("detail") as detail;
      const order = formData.get("order") as order;
      const feature = formData.get("feature") as feature;

      const images = formData.getAll('files') as File[];
      const filesArray = Array.from(images).map((f) => f.name) as string[];

      const { data: project, error } = await supabase
        .from('project')
        .insert([{
          name,
          description,
          detail,
          order,
          feature,
          files: filesArray,
          status: "in queue"
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating project:', error);
        toast.error("Error creating project: " + error.message);
        actions.hideLoading();
        return;
      }

      for (const image of images) {

        const imageFormData = new FormData();
        imageFormData.append('id', project.id.toString() as string);
        imageFormData.append('file', image);
        try {
          await fetch('/api/image-upload', {
            method: 'POST',
            headers,
            body: imageFormData
          })
          console.log(`Image ${image.name} uploaded successfully`);
          toast.success(`Image ${image.name} uploaded successfully`);
        } catch (error) {
          console.error(`Error processing image ${image.name}:`, error);
          toast.error(`Error processing image ${image.name}: ${error}`);
        }
      }

      const sendToQueueFormData = new FormData();
      sendToQueueFormData.append('id', project.id.toString() as string);

      const response = await fetch('/api/send-to-queue', {
        method: 'POST',
        headers,
        body: sendToQueueFormData
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error sending project to queue:', errorData);
        toast.error("Error sending project to queue: " + errorData.error);
        actions.hideLoading();
        return;
      }

      toast.success("Progetto inviato alla coda");
      actions.hideLoading();
      router.push("/projects");
    } catch (error: any) {
      actions.hideLoading();
      toast.error(error.message);
      return;
    }
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
