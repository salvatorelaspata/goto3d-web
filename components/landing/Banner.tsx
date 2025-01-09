import { UserResponse } from "@supabase/supabase-js";

interface BannerProps {
  user: UserResponse["data"]["user"] | null;
  goToLogin: () => Promise<never>;
  goToDashboard: () => Promise<never>;
}

export default function Banner({
  user,
  goToLogin,
  goToDashboard,
}: BannerProps) {
  return (
    <section className="flex h-full items-center rounded-lg bg-palette1 text-palette3 md:h-[77vh]">
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center md:flex-row">
          <div className="mb-8 w-full md:mb-0 md:w-1/2">
            <h1 className="mb-4 text-5xl font-bold">goto3d</h1>
            <div className="mb-6 text-xl">
              <p>Trasforma le tue idee in realtà 3D.</p>
              <p>
                Con goto3d, dai vita ai tuoi oggetti partendo da semplici foto,
                crea un catalogo 3D mozzafiato e personalizza i tuoi modelli
                come mai prima d'ora.
              </p>
            </div>
            {user ? (
              <form action={goToDashboard}>
                <button
                  id="goToDashboard"
                  className="rounded-lg border bg-palette3 px-8 py-3 text-lg font-semibold text-palette1 transition duration-300 hover:bg-palette1 hover:text-palette3"
                >
                  Vai alla dashboard
                </button>
              </form>
            ) : (
              <form action={goToLogin}>
                <button className="rounded-lg border bg-palette3 px-8 py-3 text-lg font-semibold text-palette1 transition duration-300 hover:bg-palette1 hover:text-palette3">
                  Inizia ora
                </button>
              </form>
            )}
          </div>
          <div className="w-full md:w-1/2">
            <div className="aspect-w-16 aspect-h-9 flex justify-center">
              <img
                width="300"
                height="300"
                src="placeholder-image.png"
                alt="goto3d demo"
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
