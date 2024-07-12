"use client";
import { deleteProject } from "@/app/projects/[id]/actions";
import { actions } from "@/store/main";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { toast } from "react-toastify";
interface DangerZoneProps {
  id: number;
}

export const DangerZone: React.FC<DangerZoneProps> = ({ id }) => {
  const router = useRouter();
  let [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isPending) return;
  }, [isPending]);

  const onSubmit = async (formData: FormData) => {
    if (
      confirm(
        "Are you sure you want to delete this project? This action is irreversible.",
      )
    ) {
      const id = formData.get("id");
      console.log("id", id);
      actions.showLoading();

      startTransition(async () => {
        try {
          toast.info("Cancellazione in corso...");
          if (id) await deleteProject({ id: parseInt(id as string) });
          toast.success("Progetto cancellato con successo");
        } catch (error: any) {
          actions.hideLoading();
          toast.error(error.message);
          return;
        }
        actions.hideLoading();
        router.push("/projects");
      });
    }
  };
  return (
    <form action={onSubmit} className="flex justify-end">
      <input type="hidden" name="id" value={id} />
      <button
        onClick={() => {}}
        type="submit"
        className="rounded-lg bg-red-500 p-2 text-palette3"
      >
        Delete project
      </button>
    </form>
  );
};
