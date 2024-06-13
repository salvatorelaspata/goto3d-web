import PageTitle from "@/components/PageTitle";
import { doCreate } from "./actions";
import { protectedRoute } from "../../projects/actions";
import { Input } from "@/components/forms/Input";
import { Textarea } from "@/components/forms/Textarea";
import { createClient } from "@/utils/supabase/server";
import SectionTitle from "@/components/SectionTitle";
import { DashboardCard } from "@/components/DashboardCard";

const getProjects = async () => {
  const supabase = createClient();
  const { data: projects, error } = await supabase
    .from("project")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return projects;
};

export default async function NewCatalog() {
  await protectedRoute();
  const projects = await getProjects();
  return (
    <div className="m-4 bg-palette5 rounded-lg">
      <PageTitle title="NUOVO CATALOGO" />
      <div className="flex flex-col">
        <div className="grid gap-6 h-full p-4">
          <div className="w-full max-w-2xl mx-auto p-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="grid grid-cols-1">
              <Input
                id="title"
                label="Title"
                name="title"
                type="text"
                placeholder="Enter a title"
              />
              <Textarea
                id="description"
                label="Description"
                name="description"
                type="textarea"
                placeholder="Enter a title"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <SectionTitle title="Visibility" />
                  <div className="w-full grid grid-cols-2 gap-2">
                    <>
                      <label
                        htmlFor="public"
                        className="cursor-pointer text-palette3"
                      >
                        Public
                      </label>
                      <input
                        radioGroup="visibility"
                        type="radio"
                        id="public"
                        name="visibility"
                        value="public"
                      />
                    </>
                    <>
                      <label
                        htmlFor="private"
                        className="cursor-pointer text-palette3"
                      >
                        Private
                      </label>
                      <input
                        radioGroup="visibility"
                        type="radio"
                        id="private"
                        name="visibility"
                        value="private"
                      />
                    </>
                  </div>
                </div>
                <div className="grid gap-2">
                  <SectionTitle title="Tags" />
                  <div className="max-h-[300px] rounded-md border overflow-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <SectionTitle title="Projects" />

            <div className="max-w-2xl max-h-[400px] overflow-auto mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
              <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {projects.map((option) => (
                  <DashboardCard
                    key={option.id}
                    navTo="#"
                    id={option.id + ""}
                    name={option.name || ""}
                    description={option.description || ""}
                  />
                  // <Card
                  //   key={option.id}
                  //   className={`group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 ease-in-out hover:-translate-y-2`}
                  // >
                  //   <div className="flex items-center gap-2">
                  //     <Checkbox
                  //       id={`project-${option.value}`}
                  //       checked={selectedProjects.includes(
                  //         option.value
                  //       )}
                  //       onCheckedChange={() =>
                  //         handleProjectSelect(option.value)
                  //       }
                  //     />
                  //     <Label
                  //       htmlFor={`project-${option.value}`}
                  //       className="text-sm font-medium cursor-pointer"
                  //     >
                  //       {option.label}

                  //   </div>
                  //   <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  //     {option.description}
                  //   </div>
                  // </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <form action={doCreate}>
        <Input label="Titolo" name="title" type="text" id="title" />
        <Textarea
          label="Descrizione"
          name="description"
          type="text"
          id="description"
        />
        <label className="block text-sm font-medium text-gray-700">
          Pubblico
        </label>
        <MultiSelect />
      </form> */}
    </div>
  );
}
