// import { FieldProps } from "@/components/forms/Form";
// import { Database } from "@/types/supabase";
// import { createClient } from "@/utils/supabase/server";
// import { useSupabaseClient } from "@supabase/auth-helpers-react";

// const fetchData = async () => {
//   const supabase = createClient();
//   const {
//     data: projects,
//     error,
//     count,
//   } = await supabase
//     .from("project")
//     .select("*", { count: "exact" })
//     .order("created_at", { ascending: false });

//   const mcProject =
//     projects?.map((project) => {
//       return {
//         label: project.name,
//         value: project.id,
//       };
//     }) || [];
//   mcProject.unshift({ label: "Select Projects", value: "" });

//   const fields: FieldProps[] = [
//     {
//       id: "title",
//       label: "Title",
//       name: "title",
//       type: "text",
//     },
//     {
//       id: "description",
//       label: "Description",
//       name: "description",
//       type: "textarea",
//     },
//     {
//       id: "public",
//       label: "Public",
//       name: "public",
//       type: "select",
//       options: [
//         { label: "Select Public", value: "" },
//         { label: "Public", value: "public" },
//         { label: "Private", value: "private" },
//       ],
//     },
//     {
//       id: "projects",
//       label: "Projects",
//       name: "projects",
//       type: "select",
//       options: mcProject,
//       multiple: true,
//     },
//   ];
//   return {
//     fields,
//   };
// };

export default async function NewCatalog() {
  return <h1>New Catalog</h1>;
  // const { fields } = await fetchData();
  // const supabase = createClient();
  // const onSubmit = async ({
  //   title,
  //   description,
  //   public: _public,
  //   projects,
  // }: any) => {
  //   // save project
  //   const { data: _dataCatalog, error: _errorCatalog } = await supabase
  //     .from("catalog")
  //     .insert({ title, description, public: _public === "public" })
  //     .select("id")
  //     .single();
  //   if (_errorCatalog) {
  //     console.log(_errorCatalog);
  //     return;
  //   }
  //   const { data: _dataCatalogUpdate, error: _errorCatalogUpdate } =
  //     await supabase
  //       .from("project")
  //       .update({ catalog_id: _dataCatalog.id })
  //       .eq("id", projects);
  //   if (_errorCatalogUpdate) {
  //     console.log(_errorCatalogUpdate);
  //     return;
  //   }
  // };
  return <>{/* <Form fields={fields} onSubmit={onSubmit} /> */}</>;
}
