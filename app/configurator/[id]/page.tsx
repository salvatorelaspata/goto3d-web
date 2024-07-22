import PageTitle from "@/components/ui/PageTitle";
import { protectedRoute } from "@/app/actions";

export default async function Configurator() {
  await protectedRoute();

  return (
    <>
      <section className="m-4 flex h-[77vh] items-center justify-center rounded-lg bg-palette2 bg-gradient-to-b from-[#006D77] to-[#83C5BE]"></section>
      <section className="m-4 flex flex-col justify-center rounded-lg bg-palette2">
        <PageTitle title="Dettagli" />
        <div className="mx-auto my-4 w-full max-w-2xl rounded-lg bg-palette5 py-8 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="col-span-2 py-2 md:col-span-1">
            <h3 className="mb-2 border-b border-palette3 font-mono text-xl font-bold text-palette1">
              General Info
            </h3>
          </div>
          <div className="col-span-2 py-2 md:col-span-1">
            <h3 className="mb-2 border-b border-palette3 font-mono text-xl font-bold text-palette1">
              Timestamps
            </h3>
          </div>
          <div className="col-span-2 py-2 md:col-span-1">
            <h3 className="mb-2 border-b border-palette3 font-mono text-xl font-bold text-palette1">
              Additional Info
            </h3>
          </div>
        </div>
      </section>
    </>
  );
}
