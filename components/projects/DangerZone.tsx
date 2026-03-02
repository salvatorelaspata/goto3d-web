"use client";
import { deleteProject } from "@/app/[locale]/projects/[id]/actions";
import { actions } from "@/store/main";
import { useRouter } from "@/i18n/routing";
import { useEffect, useTransition } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

interface DangerZoneProps {
  id: number;
}

export const DangerZone: React.FC<DangerZoneProps> = ({ id }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("projects");

  useEffect(() => {
    if (isPending) return;
  }, [isPending]);

  const onSubmit = async (formData: FormData) => {
    // eslint-disable-next-line no-alert
    if (confirm(t("deleteConfirm"))) {
      const id = formData.get("id");
      actions.showLoading();

      startTransition(async () => {
        try {
          toast.info(t("deleting"));
          if (id) await deleteProject({ id: parseInt(id as string) });
          toast.success(t("deleted"));
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
        className="rounded-lg bg-red-500 dark:bg-red-700 p-2 text-palette3"
      >
        {t("deleteProject")}
      </button>
    </form>
  );
};
