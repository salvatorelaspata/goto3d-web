"use client";

import { doCreate } from "@/app/catalogs/new/actions";
import type { Database } from "@/types/supabase";
import { Input } from "../forms/Input";
import { Textarea } from "../forms/Textarea";
import SectionTitle from "../ui/SectionTitle";
import { DashboardCard } from "../DashboardCard";
import SaveButton from "../wizard/SaveButton";
import { toast } from "react-toastify";
import { actions } from "@/store/main";
import { redirect } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import Tags from "../Tags";
type Catalog = Database["public"]["Tables"]["catalog"]["Row"] & {
  projects: Database["public"]["Tables"]["project_catalog"]["Row"][];
};
interface FormProps {
  projects: Database["public"]["Tables"]["project"]["Row"][];
  catalog?: Catalog | null;
}
export const Form: React.FC<FormProps> = ({ projects, catalog }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [_public, setPublic] = useState<boolean>(true);
  const [_private, setPrivate] = useState<boolean>(false);
  const [project, setProject] = useState<number[]>([]);

  let [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isPending) return;
  }, [isPending]);

  useEffect(() => {
    if (catalog) {
      setTitle(catalog.title as string);
      setDescription(catalog.description as string);
      setPublic(catalog.public as boolean);
      setPrivate(!catalog.public as boolean);

      const p = catalog.projects.map((p) => p.project_id);
      setProject(p as number[]);
    }
  }, []);

  const onSubmit = async (formData: FormData) => {
    actions.showLoading();

    startTransition(async () => {
      try {
        toast.info("Creazione catalogo in corso...");
        await doCreate(formData);
        toast.success("Catalogo creato con successo");
      } catch (error: any) {
        actions.hideLoading();
        toast.error(error.message);
        return;
      }
      actions.hideLoading();
      redirect("/catalogs");
    });
  };

  return (
    <form action={onSubmit}>
      <div className="grid gap-4 h-full p-4">
        <div className="w-full max-w-2xl mx-auto p-4 sm:px-4 lg:max-w-7xl lg:px-4">
          <SectionTitle title="General Info" />
          <div className="grid grid-cols-1">
            <Input
              id="title"
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              name="title"
              type="text"
              placeholder="Enter a title"
            />
            <Textarea
              id="description"
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              name="description"
              type="textarea"
              placeholder="Enter a title"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <SectionTitle title="Visibility" borderBottom />
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      className="peer hidden"
                      id="public"
                      value={"public"}
                      checked={_public}
                      onChange={() => {
                        setPublic(false);
                        setPrivate(true);
                      }}
                      type="radio"
                      name="visibility"
                    />
                    <span className="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-palette3 bg-white peer-checked:bg-palette1"></span>

                    <label
                      className="flex cursor-pointer flex-col rounded-lg border border-palette3 p-4 peer-checked:border-4 peer-checked:bg-palette1"
                      htmlFor="public"
                    >
                      <span className="text-lg font-semibold uppercase">
                        🤩
                      </span>
                      <span className="mt-2 text-xl font-bold text-palette3">
                        Pubblico
                      </span>
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      className="peer hidden"
                      id="private"
                      value={"private"}
                      checked={_private}
                      onChange={() => {
                        setPublic(false);
                        setPrivate(true);
                      }}
                      // value={_private ? "private" : ""}
                      type="radio"
                      name="visibility"
                    />
                    <span className="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-palette3 bg-white peer-checked:bg-palette1"></span>

                    <label
                      className="flex cursor-pointer flex-col rounded-lg border border-palette3 p-4 peer-checked:border-4 peer-checked:bg-palette1"
                      htmlFor="private"
                    >
                      <span className="text-lg font-semibold uppercase">
                        🙈
                      </span>
                      <span className="mt-2 text-xl font-bold text-palette3">
                        Private
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <SectionTitle title="Tags" borderBottom />
                <div className="grid grid-cols-4 gap-2">
                  <Tags text="Tag 1" />
                  <Tags text="Tag 2" type="secondary" />
                  <Tags text="Tag 3" type="tertiary" />
                  <Tags text="Tag 4" type="success" />
                  <Tags text="Tag 5" type="warning" />
                  <Tags text="Tag 6" type="danger" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto px-4 sm:px-4 lg:max-w-7xl lg:px-4">
          <SectionTitle title="Projects" borderBottom />

          <div className="max-w-2xl max-h-[350px] overflow-auto mx-auto px-4 sm:px-4 lg:max-w-7xl lg:px-4">
            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-4">
              {projects.map((option) => (
                <DashboardCard
                  selectable={true}
                  multiple={true}
                  radioGroup="project"
                  checked={project.includes(option.id)}
                  onChange={(e) => {
                    const id = parseInt(e.target.value);
                    if (e.target.checked) {
                      setProject([...project, id]);
                    } else {
                      setProject(project.filter((p) => p !== id));
                    }
                  }}
                  key={option.id}
                  navTo="#"
                  id={option.id + ""}
                  name={option.name || ""}
                  description={option.description || ""}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <SaveButton />
    </form>
  );
};
