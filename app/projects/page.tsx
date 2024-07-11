import PageTitle from "@/components/ui/PageTitle";
import { Projects } from "@/components/projects/Projects";
import { protectedRoute } from "../actions";
import { getProjects } from "./actions";

export default async function Project() {
  await protectedRoute();
  const projects = await getProjects();
  return (
    <>
      <section className="m-4 flex h-[77vh] items-center justify-center rounded-lg bg-palette2 bg-gradient-to-b from-[#006D77] to-[#83C5BE]">
        <div className="max-w-2xl space-y-6 px-4 text-center text-palette3 md:px-6">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Crea il tuo progetto 3D
          </h1>
          <p className="text-lg md:text-xl">
            Hai un'oggetto che vuoi trasformare in 3D? Inizia subito!
          </p>
          <form action="/projects/new">
            <button
              type="submit"
              className="w-full max-w-2xl rounded-sm bg-palette3 p-6 text-3xl text-palette1 hover:bg-palette1 hover:text-palette3"
            >
              CREA
            </button>
          </form>
        </div>
      </section>
      <section className="m-4 rounded-lg bg-palette2">
        <PageTitle title="I Tuoi Progetti" />
        <Projects projects={projects} />
      </section>
    </>
  );
}
