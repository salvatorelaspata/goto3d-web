"use client";
import { useStore } from "@/store/wizardStore";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { actions } from "@/store/main";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createClient } from "@/utils/supabase/client";
import { validateProjectFormData } from "@/lib/validations/project";

const supabase = createClient();

export const Wizard: React.FC = () => {
  const { currentStep } = useStore();
  const router = useRouter();

  const onSubmit = async (formData: FormData) => {
    actions.showLoading();

    // Validate form data
    const validation = validateProjectFormData(formData);
    if (!validation.success) {
      const errors = validation.error.issues.map((e) => e.message).join(", ");
      toast.error(errors);
      actions.hideLoading();
      return;
    }

    const { name, description, detail, order, feature, files: images } = validation.data;

    try {
      toast.info("Creazione progetto in corso");
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      const headers = { 'Authorization': `Bearer ${token}` }
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
          toast.success(`Image ${image.name} uploaded successfully`);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          toast.error(`Error processing image ${image.name}: ${message}`);
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
        toast.error("Error sending project to queue: " + errorData.error);
        actions.hideLoading();
        return;
      }

      toast.success("Progetto inviato alla coda");
      actions.hideLoading();
      router.push("/projects");
    } catch (err) {
      actions.hideLoading();
      const message = err instanceof Error ? err.message : "Errore sconosciuto";
      toast.error(message);
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
