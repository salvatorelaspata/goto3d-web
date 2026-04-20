"use client";

import type { Database } from "@/types/supabase";

import React, { useEffect, useTransition } from "react";
import { ProjectToggle } from "./ProjectToggle";
import { deleteCatalog, doCreate } from "@/app/[locale]/catalogs/new/actions";
import { actions } from "@/store/main";
import { actions as catalogActions } from "@/store/catalogStore";
import { toast } from "react-toastify";
import { useStore } from "@/store/catalogStore";
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { updateCatalog } from "@/app/[locale]/catalogs/[id]/actions";
import { useTranslations } from "next-intl";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Input, Textarea, Button, Toggle } from "@/components/ui/FormElements";

export type FormCatalogExtra =
  Database["public"]["Tables"]["catalog"]["Row"] & {
    projects: {
      project_id: number;
    }[];
  };

interface FormProps {
  projects: Database["public"]["Tables"]["project"]["Row"][];
  catalog?: FormCatalogExtra;
}

export const Form: React.FC<FormProps> = ({ projects, catalog }) => {
  const { id, title, description, public: visibility } = useStore();
  const { setTitle, setDescription, setPublic, reset } = catalogActions;
  const t = useTranslations("catalogs");
  const tc = useTranslations("common");

  useEffect(() => {
    if (catalog) {
      setTitle(catalog.title || "");
      setDescription(catalog.description || "");
      setPublic(catalog.public || false);
      catalog.projects.forEach((project) => {
        catalogActions.addProject(project.project_id);
      });
    }
  }, [catalog, setTitle, setDescription, setPublic]);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isPending) return;
  }, [isPending]);

  const router = useRouter();

  const onSubmit = async (formData: FormData) => {
    actions.showLoading();
    const action = formData.get("btn") as string;
    startTransition(async () => {
      try {
        if (action === "delete") {
          // eslint-disable-next-line no-alert
          const c = confirm(t("deleteConfirm"));
          if (!c) {
            actions.hideLoading();
            return;
          }
          await onDelete(formData);
        } else if (action === "create") {
          await onCreate(formData);
        } else if (action === "update") {
          await onUpdate(formData);
        }
        router.push("/catalogs");
      } catch (error: any) {
        toast.error(error.message);
      }
      actions.hideLoading();
    });
  };

  const onCreate = async (formData: FormData) => {
    formData.append("visibility", visibility ? "true" : "false");
    const { id } = await doCreate(formData);
    toast.success(t("catalogCreated", { id }));
  };

  const onDelete = async (formData: FormData) => {
    const id = formData.get("id");
    if (!id) return;
    await deleteCatalog(formData);
    toast.success(t("catalogDeleted", { id: String(id) }));
  };

  const onUpdate = async (formData: FormData) => {
    const id = formData.get("id");
    if (!id) return;
    await updateCatalog(formData);
    toast.success(t("catalogUpdated", { id: String(id) }));
  };

  return (
    <form action={onSubmit} className="mx-auto max-w-6xl space-y-4 p-4">
      <input type="hidden" name="id" value={catalog?.id} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader title={t("generalInfo")} />
          <CardContent className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-palette1"
              >
                {t("catalogTitle")}
              </label>
              <Input
                id="title"
                placeholder={t("titlePlaceholder")}
                className="mt-1"
                value={title as string}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-palette1"
              >
                {t("catalogDescription")}
              </label>
              <Textarea
                id="description"
                placeholder={t("descriptionPlaceholder")}
                className="mt-1"
                value={description as string}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4 md:col-span-1">
          <Card>
            <CardHeader title={t("visibility")} />
            <CardContent className="grid grid-cols-2">
              <Toggle
                side="left"
                active={visibility as boolean}
                onClick={() => setPublic(true)}
              >
                <span className="flex items-center justify-center sm:justify-start">
                  <span className="m-2">🌍</span>
                  <span className="">{t("public")}</span>
                </span>
              </Toggle>
              <Toggle
                side="right"
                active={!visibility as boolean}
                onClick={() => setPublic(false)}
              >
                <span className="flex items-center">
                  <span className="m-2">🔒</span>
                  {t("private")}
                </span>
              </Toggle>
              {/* descrizione della visibilità  */}
              <p className="col-span-2 my-4 text-sm text-palette1">
                {visibility ? t("publicDesc") : t("privateDesc")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader title={t("preview")} />
            <CardContent className="flex items-center justify-center">
              <Link
                href={`/artifact/${catalog?.artifact}`}
                className="w-full"
                target="_blank"
              >
                <p className="text-palette3 underline-offset-1 hover:underline hover:underline-offset-2">
                  {t("viewCatalog")}
                </p>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader title={t("addProjects")} />
        <CardContent className="">
          {/* create scroll container */}
          <div className="grid h-64 grid-cols-2 gap-4 overflow-y-auto lg:grid-cols-4">
            {projects.map((option) => (
              <ProjectToggle
                key={option.id}
                id={option.id}
                name={option.name || ""}
                description={option.description || ""}
                radioGroup="project"
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        {!catalog ? (
          <Button
            type="button"
            name="btn"
            onClick={reset}
            className="w-64 bg-palette3 px-6 py-2 text-palette1 transition-colors duration-200 hover:bg-palette3"
          >
            Reset
          </Button>
        ) : (
          <Button
            type="submit"
            value={"delete"}
            name="btn"
            className="w-64 bg-red-500 dark:bg-red-700 px-6 py-2 text-palette3 transition-colors duration-200"
          >
            {tc("delete")}
          </Button>
        )}
        <Button
          type="submit"
          value={catalog ? "update" : "create"}
          name="btn"
          className="w-64 bg-palette1 px-6 py-2 text-palette3 shadow-lg transition-colors duration-200 hover:bg-palette2 hover:shadow-xl"
        >
          {catalog ? tc("update") : tc("create")}
        </Button>
      </div>
    </form>
  );
};
