import PageTitle from "@/components/ui/PageTitle";
import { Wizard } from "@/components/wizard/Wizard";
import { protectedRoute } from "@/app/actions";

export default async function NewProject() {
  await protectedRoute();
  return (
    <div className="m-4 rounded-lg bg-palette2">
      <PageTitle title="NUOVO PROGETTO" />
      <Wizard />
    </div>
  );
}
