"use client";
import { deleteProject } from "@/app/projects/[id]/actions";
import { actions } from "@/store/main";
import { redirect } from "next/navigation";
import { useEffect, useTransition } from "react";
import { toast } from "react-toastify";
interface DangerZoneProps {
  id: number;
}

export const DangerZone: React.FC<DangerZoneProps> = ({ id }) => {
  let [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isPending) return;
  }, [isPending]);

  const onSubmit = async (formData: FormData) => {
    if (
      confirm(
        "Are you sure you want to delete this project? This action is irreversible."
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
        redirect("/projects");
      });
    }
  };
  return (
    <form action={onSubmit} className="flex justify-end">
      <input type="hidden" name="id" value={id} />
      <button
        onClick={() => {}}
        type="submit"
        className="bg-red-500 text-white rounded-lg p-2"
      >
        Delete project
      </button>
    </form>
  );
};
