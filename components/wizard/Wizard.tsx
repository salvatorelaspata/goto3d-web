"use client";
import { useStore } from "@/store/wizardStore";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
// import { processProject } from "@/app/projects/new/actions";
import { actions } from "@/store/main";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const Wizard: React.FC = () => {
  const { currentStep } = useStore();
  const router = useRouter();

  const onSubmit = async (formData: FormData) => {
    actions.showLoading();
    try {
      toast.info("Creazione progetto in corso");
      // await processProject(formData);
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      const response = await fetch('/api/process-wizard', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Errore durante la creazione del progetto');
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
