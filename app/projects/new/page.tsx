import PageTitle from "@/components/PageTitle";
import { Wizard } from "@/components/wizard/Wizard";
import { doCreate } from "./actions";
import { protectedRoute } from "../../actions";

export default async function NewProject() {
  await protectedRoute();
  return (
    <div className="m-4 bg-palette2 rounded-lg">
      <PageTitle title="NUOVO PROGETTO" />
      {/* <div className="flex flex-col sm:h-full w-full bg-palette2 text-gray-100 shadow-md rounded-xl"> */}
      <form action={doCreate}>
        <Wizard />
      </form>
      {/* </div> */}
    </div>
  );
}
