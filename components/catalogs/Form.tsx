"use client";

import type { Database } from "@/types/supabase";

import React, { useEffect, useTransition } from "react";
import { ProjectToggle } from "./ProjectToggle";
import { deleteCatalog, doCreate } from "@/app/catalogs/new/actions";
import { actions } from "@/store/main";
import { actions as catalogActions } from "@/store/catalogStore";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";
import { useStore } from "@/store/catalogStore";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => (
  <div
    className={`bg-palette2 shadow-md rounded-lg overflow-hidden ${className || ""}`}
  >
    {children}
  </div>
);

interface CardHeaderProps {
  title: string;
  children?: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({ title, children }) => (
  <div className="px-6 py-4 border-b border-palette3">
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
    className={`w-full px-3 py-2 border border-palette3 rounded-md focus:outline-none focus:ring-2 focus:ring-palette5 ${className || ""}`}
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
    className={`w-full px-3 py-2 border border-palette3 rounded-md focus:outline-none focus:ring-2 focus:ring-palette5 ${className || ""}`}
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
    className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${className || ""}`}
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
        ? "bg-palette1 text-palette3 scale-105"
        : "bg-palette3 text-palette1 scale-95"
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

  const onSubmit = async (formData: FormData) => {
    // RUN SOME VALIDATION HERE
    actions.showLoading();

    startTransition(async () => {
      try {
        formData.append("visibility", visibility ? "true" : "false");
        const { id } = await doCreate(formData);
        toast.success(`Catalog created: ${id}`);
      } catch (error: any) {
        actions.hideLoading();
        toast.error(error.message);
        return;
      }
      actions.hideLoading();
      redirect("/catalogs");
    });
  };

  const onDelete = async (formData: FormData) => {
    if (
      confirm(
        "Are you sure you want to delete this catalog? This action is irreversible."
      )
    ) {
      actions.showLoading();
      startTransition(async () => {
        try {
          toast.info("Deleting catalog...");
          await deleteCatalog(formData);
          toast.success("Catalog deleted successfully");
        } catch (error: any) {
          actions.hideLoading();
          toast.error(error.message);
          return;
        }
        actions.hideLoading();
        redirect("/catalogs");
      });
    }
  };

  return (
    <form action={onSubmit} className="max-w-6xl mx-auto p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto h-64">
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
            onClick={reset}
            className="px-6 py-2 w-64 bg-palette3 text-palette1 hover:bg-palette3 transition-colors duration-200"
          >
            Reset
          </Button>
        ) : (
          <button
            onClick={() => {
              e.preventDefault();
              e.stopPropagation();
              const formData = new FormData();
              if (id) formData.append("id", id.toString());
              onDelete(formData);
            }}
            type="submit"
            className="bg-red-500 text-white rounded-lg p-2"
          >
            Delete project
          </button>
        )}
        <Button
          type="submit"
          className="px-6 py-2 w-64 bg-palette1 text-palette3 hover:bg-palette2 transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          {catalog ? "Salva" : "Crea"}
        </Button>
      </div>
    </form>
  );
};
