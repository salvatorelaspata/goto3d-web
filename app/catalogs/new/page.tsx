import PageTitle from "@/components/PageTitle";
import { doCreate } from "./actions";
import { protectedRoute } from "../../projects/actions";
import { Input } from "@/components/forms/Input";
import { Textarea } from "@/components/forms/Textarea";
import { createClient } from "@/utils/supabase/server";
import MultiSelect from "@/components/forms/MultiSelect";

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
  return (
    <div className="m-4 bg-palette5 rounded-lg">
      <PageTitle title="NUOVO CATALOGO" />

      <form action={doCreate}>
        <Input label="Titolo" name="title" type="text" id="title" />
        <Textarea
          label="Descrizione"
          name="description"
          type="text"
          id="description"
        />

        {/* <Input label="Prezzo" name="price" type="text" id="price" /> */}
        <label className="block text-sm font-medium text-gray-700">
          Pubblico
        </label>
        <MultiSelect />
      </form>
    </div>
  );
}
