import { Iubenda } from "@/components/Iubenda";
import Banner from "@/components/landing/Banner";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "@/i18n/routing";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("landing");

  const goToLogin = async () => {
    "use server";
    const locale = (await getLocale()) as Locale;
    redirect({ href: "/login", locale });
  };
  const goToDashboard = async () => {
    "use server";
    const locale = (await getLocale()) as Locale;
    redirect({ href: "/dashboard", locale });
  };
  const goToNewCatalog = async () => {
    "use server";
    const locale = (await getLocale()) as Locale;
    redirect({ href: "/catalogs/new", locale });
  };
  const goToNewProject = async () => {
    "use server";
    const locale = (await getLocale()) as Locale;
    redirect({ href: "/projects/new", locale });
  };
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="mx-auto p-4">
        <Banner
          user={user}
          goToLogin={goToLogin}
          goToDashboard={goToDashboard}
          goToNewCatalog={goToNewCatalog}
          goToNewProject={goToNewProject}
          translations={{
            bannerTitle: t("bannerTitle"),
            bannerSubtitle: t("bannerSubtitle"),
            bannerDescription: t("bannerDescription"),
            goToDashboard: t("goToDashboard"),
            newProject: t("newProject"),
            newCatalog: t("newCatalog"),
            startNow: t("startNow"),
          }}
        />
        {/* WORKFLOW */}
        <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-palette2 p-6 px-4 shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-palette3">
              {t("heroTitle")}
            </h2>
            <p className="text-palette1">
              {t("heroDescription")}
            </p>
          </div>
          <div className="rounded-lg bg-palette2 p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-palette3">
              {t("catalogTitle")}
            </h2>
            <p className="text-palette1">
              {t("catalogDescription")}
            </p>
          </div>
          <div className="rounded-lg bg-palette2 p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-palette3">
              {t("customizationTitle")}
            </h2>
            <p className="text-palette1">
              {t("customizationDescription")}
            </p>
          </div>
        </section>
        {/* FEATURES */}
        <section className="bg-palette3">
          <div className="">
            <h2 className="m-4 text-center text-3xl font-bold text-palette1">
              {t("featuresTitle")}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col items-center rounded-lg border border-palette1 bg-palette2 p-8 text-center">
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-palette5">
                  <svg
                    className="h-12 w-12 text-palette3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                </div>
                <h3 className="my-4 text-xl font-semibold text-palette3">
                  {t("feature1Title")}
                </h3>
                <p className="text-palette1">
                  {t("feature1Description")}
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg border border-palette1 bg-palette2 p-8 text-center">
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-palette5">
                  <svg
                    className="h-12 w-12 text-palette3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    ></path>
                  </svg>
                </div>
                <h3 className="my-4 text-xl font-semibold text-palette3">
                  {t("feature2Title")}
                </h3>
                <p className="text-palette1">
                  {t("feature2Description")}
                </p>
              </div>

              <div className="flex flex-col items-center rounded-lg border border-palette1 bg-palette2 p-8 text-center">
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-palette5">
                  <svg
                    className="h-12 w-12 text-palette3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                  </svg>
                </div>
                <h3 className="my-4 text-xl font-semibold text-palette3">
                  {t("feature3Title")}
                </h3>
                <p className="text-palette1">
                  {t("feature3Description")}
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg border border-palette1 bg-palette2 p-8 text-center">
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-palette5">
                  <svg
                    className="h-12 w-12 text-palette3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <h3 className="my-4 text-xl font-semibold text-palette3">
                  {t("feature4Title")}
                </h3>
                <p className="text-palette1">
                  {t("feature4Description")}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="p-4 text-center">
          {!user && (
            <>
              <h2 className="mb-4 text-3xl font-bold text-palette5">
                {t("ctaTitle")}
              </h2>
              <form action={goToLogin}>
                <button className="rounded-lg border border-palette1 bg-palette1 px-8 py-3 text-lg font-semibold text-palette5 transition duration-300 hover:bg-palette3 hover:text-palette1">
                  {t("ctaButton")}
                </button>
              </form>
            </>
          )}
        </section>
      </main>

      <footer className="bg-palette1 py-4 text-palette3">
        <div className="container mx-auto px-4 text-center">
          <p>
            {t("footer")} <Iubenda />
          </p>
        </div>
      </footer>
    </div>
  );
}
