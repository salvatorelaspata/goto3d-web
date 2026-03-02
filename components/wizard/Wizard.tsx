"use client";
import { useStore, actions as wizardActions } from "@/store/wizardStore";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { UploadProgress } from "./UploadProgress";
import { useRouter } from "@/i18n/routing";
import { toast } from "react-toastify";
import { validateProjectFormData } from "@/lib/validations/project";
import {
  createProject,
  submitProjectToQueue,
  rollbackProject,
} from "@/app/[locale]/projects/new/actions";
import { parallelLimit } from "@/lib/utils/parallelLimit";

export const Wizard: React.FC = () => {
  const { currentStep } = useStore();
  const router = useRouter();

  const onSubmit = async (formData: FormData) => {
    // Validate form data client-side
    const validation = validateProjectFormData(formData);
    if (!validation.success) {
      const errors = validation.error.issues.map((e) => e.message).join(", ");
      toast.error(errors);
      return;
    }

    const { files: images } = validation.data;

    try {
      // Phase 1: Create project via server action
      wizardActions.setUploadState("creating");

      const createResult = await createProject(formData);
      if (!createResult.success) {
        toast.error(createResult.error);
        wizardActions.resetUploadProgress();
        return;
      }

      const projectId = createResult.data.id;

      // Phase 2: Upload images in parallel (max 4 concurrent)
      wizardActions.setUploadState("uploading");
      wizardActions.setUploadTotal(images.length);

      const uploadTasks = images.map((image) => () => {
        const imageFormData = new FormData();
        imageFormData.append("id", projectId.toString());
        imageFormData.append("file", image);
        return fetch("/api/image-upload", {
          method: "POST",
          body: imageFormData,
        }).then(async (res) => {
          if (!res.ok) {
            const data = await res.json().catch(() => ({ error: "Upload failed" }));
            throw new Error(data.error || `HTTP ${res.status}`);
          }
          wizardActions.incrementUploadCompleted();
          return res;
        });
      });

      const uploadResults = await parallelLimit(uploadTasks, 4);

      const failures = uploadResults.filter((r) => r.status === "rejected");
      if (failures.length > 0) {
        for (const f of failures) {
          const reason =
            f.status === "rejected" && f.reason instanceof Error
              ? f.reason.message
              : String((f as PromiseRejectedResult).reason);
          wizardActions.addUploadError(reason);
        }
        toast.error(
          `${failures.length} immagini non caricate. Rollback in corso...`
        );
        await rollbackProject(projectId);
        wizardActions.resetUploadProgress();
        return;
      }

      // Phase 3: Submit to queue
      wizardActions.setUploadState("queuing");

      const queueResult = await submitProjectToQueue(projectId);
      if (!queueResult.success) {
        toast.error(queueResult.error);
        await rollbackProject(projectId);
        wizardActions.resetUploadProgress();
        return;
      }

      toast.success("Progetto creato e inviato alla coda");
      wizardActions.resetWizardStore();
      router.push("/projects");
    } catch (err) {
      wizardActions.resetUploadProgress();
      const message =
        err instanceof Error ? err.message : "Errore sconosciuto";
      toast.error(message);
    }
  };

  return (
    <>
      <UploadProgress />
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
    </>
  );
};
