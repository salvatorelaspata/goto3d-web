import PageTitle from "@/components/PageTitle";
import { Wizard } from "@/components/wizard/Wizard";
import { protectedRoute } from "../actions";

export default async function NewProject() {
  await protectedRoute();
  return (
    <div className="m-4 bg-palette2 rounded-lg">
      <PageTitle title="NUOVO PROGETTO" />
      <Wizard />
    </div>
  );
}
