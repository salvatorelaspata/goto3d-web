import PageTitle from "@/components/ui/PageTitle";
import { protectedRoute } from "@/app/actions";

export default async function Project() {
  await protectedRoute();
  return (
    <>
      <section className="m-4 flex h-[77vh] items-center justify-center rounded-lg bg-palette4 bg-gradient-to-b from-[#E29578] to-[#FFDDD2]">
        <div className="max-w-2xl space-y-6 px-4 text-center text-palette3 md:px-6">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Configura il tuo progetto 3D
          </h1>
          <p className="text-lg md:text-xl">
            Hai un'oggetto che vuoi configurare? Utilizza il configuratore
          </p>
          <form action="/configurator/new">
            <button
              type="submit"
              className="w-full max-w-2xl rounded-sm bg-palette3 p-6 text-3xl text-palette1 hover:bg-palette1 hover:text-palette3"
            >
              CONFIGURA
            </button>
          </form>
        </div>
      </section>
      <section className="m-4 rounded-lg bg-palette4">
        <PageTitle title="I Tuoi Progetti Configurati" />
      </section>
    </>
  );
}
