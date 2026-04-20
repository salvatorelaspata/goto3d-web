import Image from "next/image";
import { UserResponse } from "@supabase/supabase-js";
import { PlusIcon } from "@heroicons/react/solid"; // Import Heroicons

interface BannerProps {
  user: UserResponse["data"]["user"] | null;
  goToLogin: () => Promise<void | never>;
  goToDashboard: () => Promise<void | never>;
  goToNewProject: () => Promise<void | never>;
  goToNewCatalog: () => Promise<void | never>;
  translations: {
    bannerTitle: string;
    bannerSubtitle: string;
    bannerDescription: string;
    goToDashboard: string;
    newProject: string;
    newCatalog: string;
    startNow: string;
  };
}

export default function Banner({
  user,
  goToLogin,
  goToDashboard,
  goToNewProject,
  goToNewCatalog,
  translations: t,
}: BannerProps) {
  return (
    <section className="flex h-full items-center rounded-lg bg-palette1 text-palette3 md:h-[77vh]">
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center md:flex-row">
          <div className="mb-8 w-full md:mb-0 md:w-1/2">
            <h1 className="mb-4 text-5xl font-bold">{t.bannerTitle}</h1>
            <div className="mb-6 text-xl">
              <p>{t.bannerSubtitle}</p>
              <p>{t.bannerDescription}</p>
            </div>
            {user ? (
              <>
                <form action={goToDashboard}>
                  <button className="rounded-lg border bg-palette3 px-8 py-3 text-lg font-semibold text-palette1 transition duration-300 hover:bg-palette1 hover:text-palette3">
                    {t.goToDashboard}
                  </button>
                </form>
                <form action={goToNewProject}>
                  <button className="mt-4 flex items-center rounded-lg border bg-palette4 px-8 py-3 text-lg font-semibold text-palette1 transition duration-300 hover:bg-palette1 hover:text-palette4">
                    <PlusIcon className="mr-2 h-5 w-5" />
                    {t.newProject}
                  </button>
                </form>
                <form action={goToNewCatalog}>
                  <button className="mt-4 flex items-center rounded-lg border bg-palette4 px-8 py-3 text-lg font-semibold text-palette1 transition duration-300 hover:bg-palette1 hover:text-palette5">
                    <PlusIcon className="mr-2 h-5 w-5" />
                    {t.newCatalog}
                  </button>
                </form>
              </>
            ) : (
              <form action={goToLogin}>
                <button className="rounded-lg border bg-palette3 px-8 py-3 text-lg font-semibold text-palette1 transition duration-300 hover:bg-palette1 hover:text-palette3">
                  {t.startNow}
                </button>
              </form>
            )}
          </div>
          <div className="w-full md:w-1/2">
            <div className="aspect-w-16 aspect-h-9 flex justify-center">
              <Image
                width={300}
                height={300}
                src="/placeholder-image.png"
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
