"use client";

import type { Database } from "@/types/supabase";

import React, { useEffect, useTransition } from "react";
import { ProjectToggle } from "./ProjectToggle";
import { deleteCatalog, doCreate } from "@/app/catalogs/new/actions";
import { actions } from "@/store/main";
import { actions as catalogActions } from "@/store/catalogStore";
import { toast } from "react-toastify";
import { useStore } from "@/store/catalogStore";
import { useRouter } from "next/navigation";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => (
  <div
    className={`overflow-hidden rounded-lg bg-palette2 shadow-md ${className || ""}`}
  >
    {children}
  </div>
);

interface CardHeaderProps {
  title: string;
  children?: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({ title, children }) => (
  <div className="border-b border-palette3 px-6 py-4">
    {/* add effect text border */}
    <h2 className="text-xl font-semibold text-palette1">{title}</h2>
    {children}
  </div>
);

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const CardContent: React.FC<CardContentProps> = ({ children, className }) => (
  <div className={`px-6 py-4 ${className || ""}`}>{children}</div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  placeholder: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  id,
  placeholder,
  className,
  ...props
}) => (
  <input
    id={id}
    type="text"
    name={id}
    placeholder={placeholder}
    className={`w-full rounded-md border border-palette3 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-palette5 ${className || ""}`}
    {...props}
  />
);

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  placeholder: string;
  className?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  id,
  placeholder,
  className,
  ...props
}) => (
  <textarea
    id={id}
    name={id}
    placeholder={placeholder}
    className={`w-full rounded-md border border-palette3 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-palette5 ${className || ""}`}
    rows={4}
    {...props}
  />
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => (
  <button
    className={`rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${className || ""}`}
    {...props}
  >
    {children}
  </button>
);

interface ToggleProps {
  children: React.ReactNode;
  active: boolean;
  onClick?: () => void;
  side?: "left" | "right"; // determinate rounded
}

const Toggle: React.FC<ToggleProps> = ({ children, active, onClick, side }) => (
  <button
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick && onClick();
    }}
    className={`px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      active
        ? "scale-105 bg-palette1 text-palette3"
        : "scale-95 bg-palette3 text-palette1"
    } ${side === "left" && "rounded-r-none"} ${side === "right" && "rounded-l-none"} rounded-md`}
  >
    {children}
  </button>
);

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

  useEffect(() => {
    if (catalog) {
      setTitle(catalog.title || "");
      setDescription(catalog.description || "");
      setPublic(catalog.public || false);
      catalog.projects.forEach((project) => {
        catalogActions.addProject(project.project_id);
      });
    }
  }, [catalog]);

  let [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isPending) return;
  }, [isPending]);

  const router = useRouter();

  const onSubmit = async (formData: FormData) => {
    actions.showLoading();
    const action = formData.get("btn") as string;
    startTransition(async () => {
      try {
        toast.info("Deleting catalog...");
        if (action === "delete") {
          const c = confirm("Are you sure you want to delete this catalog?");
          if (!c) {
            actions.hideLoading();
            return;
          }
          await onDelete(formData);
        } else if (action === "create") {
          await onCreate(formData);
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
    toast.success(`Catalog created: ${id}`);
  };

  const onDelete = async (formData: FormData) => {
    const id = formData.get("id");
    if (!id) return;
    await deleteCatalog(formData);
    toast.success("Catalog deleted successfully " + id);
    actions.hideLoading();
  };

  return (
    <form action={onSubmit} className="mx-auto max-w-6xl space-y-4 p-4">
      <input type="hidden" name="id" value={catalog?.id} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader title="Informazioni generali" />
          <CardContent className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Titolo
              </label>
              <Input
                id="title"
                placeholder="Inserisci un titolo"
                className="mt-1"
                value={title as string}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Descrizione del catalogo (facoltativa)
              </label>
              <Textarea
                id="description"
                placeholder="Inserisci una descrizione"
                className="mt-1"
                value={description as string}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Visibilità" />
          <CardContent className="grid grid-cols-2">
            <Toggle
              side="left"
              active={visibility as boolean}
              onClick={() => setPublic(true)}
            >
              <span className="flex items-center justify-center sm:justify-start">
                <span className="m-2">🌍</span>
                <span className="">Pubblico</span>
              </span>
            </Toggle>
            <Toggle
              side="right"
              active={!visibility as boolean}
              onClick={() => setPublic(false)}
            >
              <span className="flex items-center">
                <span className="m-2">🔒</span>
                Private
              </span>
            </Toggle>
            {/* descrizione della visibilità  */}
            <p className="col-span-2 my-4 text-sm text-gray-700">
              {visibility
                ? "Tutti possono visualizzare questo catalogo"
                : "Solo tu puoi visualizzare questo catalogo"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader title="Aggiungi i progetti al tuo catalogo" />
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
            className="w-64 bg-red-500 px-6 py-2 text-palette3 transition-colors duration-200"
          >
            Elimina
          </Button>
        )}
        <Button
          type="submit"
          value={"create"}
          name="btn"
          className="w-64 bg-palette1 px-6 py-2 text-palette3 shadow-lg transition-colors duration-200 hover:bg-palette2 hover:shadow-xl"
        >
          {catalog ? "Salva" : "Crea"}
        </Button>
      </div>
    </form>
  );
};
