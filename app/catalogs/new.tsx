import Form, { FieldProps } from "@/components/forms/Form";
import { Database } from "@/types/supabase";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSideProps } from "next";

interface NewCatalogProps {
  fields: FieldProps[];
}

const NewCatalog: React.FC<NewCatalogProps> = ({ fields }) => {
  const supabase = useSupabaseClient<Database>();
  const onSubmit = async ({
    title,
    description,
    public: _public,
    projects,
  }: any) => {
    // save project
    const { data: _dataCatalog, error: _errorCatalog } = await supabase
      .from("catalog")
      .insert({ title, description, public: _public === "public" })
      .select("id")
      .single();
    if (_errorCatalog) {
      console.log(_errorCatalog);
      return;
    }
    const { data: _dataCatalogUpdate, error: _errorCatalogUpdate } =
      await supabase
        .from("project")
        .update({ catalog_id: _dataCatalog.id })
        .eq("id", projects);
    if (_errorCatalogUpdate) {
      console.log(_errorCatalogUpdate);
      return;
    }
  };
  return (
    <>
      <Form fields={fields} onSubmit={onSubmit} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createPagesServerClient(context);
  const {
    data: projects,
    error,
    count,
  } = await supabase
    .from("project")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  const mcProject =
    projects?.map((project) => {
      return {
        label: project.name,
        value: project.id,
      };
    }) || [];
  mcProject.unshift({ label: "Select Projects", value: "" });

  const fields: FieldProps[] = [
    {
      id: "title",
      label: "Title",
      name: "title",
      type: "text",
    },
    {
      id: "description",
      label: "Description",
      name: "description",
      type: "textarea",
    },
    {
      id: "public",
      label: "Public",
      name: "public",
      type: "select",
      options: [
        { label: "Select Public", value: "" },
        { label: "Public", value: "public" },
        { label: "Private", value: "private" },
      ],
    },
    {
      id: "projects",
      label: "Projects",
      name: "projects",
      type: "select",
      options: mcProject,
      multiple: true,
    },
  ];
  return {
    props: {
      fields,
    },
  };
};
export default NewCatalog;
