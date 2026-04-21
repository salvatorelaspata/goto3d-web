import { Iubenda } from "@/components/Iubenda";
import Banner from "@/components/landing/Banner";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "@/i18n/routing";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";

export default async function Home() {
  const supabase = await createClient();
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
    <div className="min-h-screen bg-g3d-bg">
      <main>
        {/* Hero */}
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

        {/* Feature cards */}
        <section className="bg-g3d-bg px-8 md:px-14 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="bg-g3d-card border border-g3d-border rounded-xl p-6 flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-g3d-coral flex items-center justify-center">
                <CameraIcon />
              </div>
              <div>
                <h3 className="text-base font-semibold text-g3d-fg mb-1">{t("heroTitle")}</h3>
                <p className="text-sm text-g3d-muted leading-relaxed">{t("heroDescription")}</p>
              </div>
              <div className="mt-auto">
                <IsoCube palette="coral" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-g3d-card border border-g3d-border rounded-xl p-6 flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-g3d-coral flex items-center justify-center">
                <FolderIcon />
              </div>
              <div>
                <h3 className="text-base font-semibold text-g3d-fg mb-1">{t("catalogTitle")}</h3>
                <p className="text-sm text-g3d-muted leading-relaxed">{t("catalogDescription")}</p>
              </div>
              <div className="mt-auto">
                <IsoCube palette="teal" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-g3d-card border border-g3d-border rounded-xl p-6 flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-g3d-coral flex items-center justify-center">
                <PaletteIcon />
              </div>
              <div>
                <h3 className="text-base font-semibold text-g3d-fg mb-1">{t("customizationTitle")}</h3>
                <p className="text-sm text-g3d-muted leading-relaxed">{t("customizationDescription")}</p>
              </div>
              <div className="mt-auto">
                <IsoCube palette="violet" />
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="px-8 md:px-14 py-10 border-t border-g3d-border">
          <h2 className="text-2xl md:text-3xl font-bold text-g3d-teal mb-10 tracking-tight">
            {t("featuresTitle")}
          </h2>
          <div className="space-y-0">
            {[
              { n: "01", title: t("feature1Title"), desc: t("feature1Description") },
              { n: "02", title: t("feature2Title"), desc: t("feature2Description") },
              { n: "03", title: t("feature3Title"), desc: t("feature3Description") },
              { n: "04", title: t("feature4Title"), desc: t("feature4Description") },
            ].map((f, i) => (
              <div
                key={f.n}
                className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-6 py-8 border-b border-g3d-border last:border-b-0"
              >
                <span className="font-mono text-sm text-g3d-muted">{f.n}</span>
                <div>
                  <h3 className="text-xl font-semibold text-g3d-fg mb-2">{f.title}</h3>
                  <p className="text-sm text-g3d-muted leading-relaxed max-w-2xl">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        {!user && (
          <section className="mx-8 md:mx-14 my-10 px-8 py-10 md:px-12 md:py-12 bg-g3d-teal rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                {t("ctaTitle")}
              </h2>
              <p className="text-sm text-[rgba(247,248,245,0.7)]">
                {locale === "it" ? "Prova gratis per 14 giorni · 5 modelli inclusi" : "Free 14-day trial · 5 models included"}
              </p>
            </div>
            <form action={goToLogin}>
              <button className="flex items-center gap-2 px-6 py-3 bg-g3d-coral hover:bg-g3d-coral-hover text-white rounded-lg font-semibold text-sm transition-colors whitespace-nowrap">
                {t("ctaButton")} →
              </button>
            </form>
          </section>
        )}
      </main>

      <footer className="px-8 md:px-14 py-5 bg-g3d-teal flex items-center justify-between text-[rgba(247,248,245,0.7)] text-xs font-mono">
        <span>© 2026 goto3d</span>
        <span>
          <Iubenda />
        </span>
      </footer>
    </div>
  );
}

/* ── Inline SVG icons ─────────────────────────── */
function CameraIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7h3l2-2h8l2 2h3v11H3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}
function FolderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h6l2 2h10v10H3z" />
    </svg>
  );
}
function PaletteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a9 9 0 00-9 9 9 9 0 009 9h2a2 2 0 002-2 2 2 0 00-2-2h-1a2 2 0 01-2-2 2 2 0 012-2h3a3 3 0 003-3 7 7 0 00-7-7z" />
    </svg>
  );
}

function IsoCube({ palette }: { palette: "teal" | "coral" | "violet" }) {
  const colors: Record<string, [string, string, string]> = {
    teal:   ["#2C9A9F", "#D96A4F", "#165E66"],
    coral:  ["#EF8F76", "#C15540", "#2C9A9F"],
    violet: ["#9B87FF", "#7C5CFF", "#5237CC"],
  };
  const [top, left, right] = colors[palette];
  return (
    <svg width="100%" height="80" viewBox="0 0 160 80" aria-hidden="true">
      <path d="M80 8 L122 32 L80 56 L38 32 Z" fill={top} />
      <path d="M38 32 L80 56 L80 80 L38 56 Z" fill={left} />
      <path d="M122 32 L80 56 L80 80 L122 56 Z" fill={right} />
    </svg>
  );
}
