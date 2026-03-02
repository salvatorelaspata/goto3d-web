import { Dashboard } from "@/components/Dashboard";
import { protectedRoute } from "@/app/[locale]/actions";

export default async function Home() {
  await protectedRoute();
  return (
    <>
      <section className="m-4 flex h-[77vh] items-center justify-center rounded-lg bg-palette3 bg-gradient-to-b from-palette2 to-palette3">
        <div className="max-w-2xl space-y-6 px-4 text-center text-palette1 md:px-6">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Dashboard
          </h1>
          <p className="text-lg md:text-xl">
            Panoramica del tuo account GoTo3D
          </p>
        </div>
      </section>
      <Dashboard />
    </>
  );
}
