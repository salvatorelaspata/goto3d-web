import PageTitle from "@/components/PageTitle";
import { getProjects, protectedRoute } from "./actions";
import { Projects } from "@/components/projects/Projects";

export default async function Project() {
  await protectedRoute();
  const projects = await getProjects();
  return (
    <>
      <section className="m-4 bg-palette2 rounded-lg h-[77vh] bg-gradient-to-b from-[#006D77] to-[#83C5BE] flex items-center justify-center">
        <div className="max-w-2xl px-4 md:px-6 text-center space-y-6 text-palette3">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Crea il tuo progetto 3D
          </h1>
          <p className="text-lg md:text-xl">
            Hai un'oggetto che vuoi trasformare in 3D? Inizia subito!
          </p>
          <form action="/projects/new">
            <button
              type="submit"
              className="w-full max-w-2xl bg-palette3 p-6 rounded-sm text-palette1 hover:bg-palette1 hover:text-palette3 text-3xl"
            >
              CREA
            </button>
          </form>
        </div>
      </section>
      <section className="m-4 bg-palette2 rounded-lg">
        <PageTitle title="I Tuoi Progetti" />
        <Projects projects={projects} />
      </section>
    </>
  );
}
