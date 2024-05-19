import PageTitle from "@/components/PageTitle";
import { Wizard } from "@/components/wizard/Wizard";

export default async function NewProject() {
  return (
    <>
      <PageTitle title="Nuovo Progetto" />
      <div className="flex flex-col sm:h-full w-full bg-gray-800 text-gray-100 shadow-md rounded-xl">
        <Wizard />
      </div>
    </>
  );
}
