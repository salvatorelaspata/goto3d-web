import { UserResponse } from "@supabase/supabase-js";

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

function G3DCube() {
  return (
    <svg width="260" height="260" viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <ellipse cx="80" cy="122" rx="40" ry="5" fill="rgba(0,0,0,0.1)" />
      {/* top face */}
      <path d="M80 28 L122 52 L80 76 L38 52 Z" fill="#5FB8B8" />
      {/* left face */}
      <path d="M38 52 L80 76 L80 124 L38 100 Z" fill="#D96A4F" />
      {/* right face */}
      <path d="M122 52 L80 76 L80 124 L122 100 Z" fill="#2C9A9F" />
      {/* lens highlight */}
      <circle cx="80" cy="76" r="10" fill="rgba(10,47,51,0.2)" />
      <circle cx="80" cy="74" r="8" fill="rgba(247,248,245,0.9)" />
      <circle cx="80" cy="74" r="4" fill="#165E66" />
    </svg>
  );
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
    <section className="bg-g3d-teal text-[#F7F8F5]">
      {/* Badge */}
      <div className="px-14 pt-10 pb-0">
        <span className="inline-block px-3 py-1 rounded-full border border-g3d-coral/40 bg-g3d-coral/10 text-[#F5AD97] text-xs font-mono tracking-wide">
          ★ {t.bannerTitle} — fotogrammetria di nuova generazione
        </span>
      </div>

      {/* Hero grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-8 md:px-14 py-12 md:py-16">
        {/* Left: copy */}
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-5">
            {t.bannerSubtitle}
          </h1>
          <p className="text-base md:text-lg leading-relaxed opacity-85 max-w-lg mb-8">
            {t.bannerDescription}
          </p>

          {user ? (
            <div className="flex flex-wrap gap-3">
              <form action={goToDashboard}>
                <button className="flex items-center gap-2 px-5 py-3 bg-g3d-coral hover:bg-g3d-coral-hover text-white rounded-lg font-semibold text-sm transition-colors">
                  {t.goToDashboard}
                  <ArrowRight />
                </button>
              </form>
              <form action={goToNewProject}>
                <button className="flex items-center gap-2 px-5 py-3 bg-transparent border border-[rgba(247,248,245,0.4)] hover:bg-[rgba(247,248,245,0.1)] text-[#F7F8F5] rounded-lg font-medium text-sm transition-colors">
                  <PlusIcon />
                  {t.newProject}
                </button>
              </form>
              <form action={goToNewCatalog}>
                <button className="flex items-center gap-2 px-5 py-3 bg-transparent border border-[rgba(247,248,245,0.4)] hover:bg-[rgba(247,248,245,0.1)] text-[#F7F8F5] rounded-lg font-medium text-sm transition-colors">
                  <PlusIcon />
                  {t.newCatalog}
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <form action={goToLogin}>
                <button className="flex items-center gap-2 px-6 py-3 bg-g3d-coral hover:bg-g3d-coral-hover text-white rounded-lg font-semibold text-sm transition-colors">
                  {t.startNow}
                  <ArrowRight />
                </button>
              </form>
            </div>
          )}

          {/* Stats */}
          <div className="mt-10 flex flex-wrap gap-6 text-xs font-mono uppercase tracking-wider opacity-65">
            <span>12k+ creatori</span>
            <span className="opacity-50">•</span>
            <span>340k modelli</span>
            <span className="opacity-50">•</span>
            <span>99.9% uptime</span>
          </div>
        </div>

        {/* Right: 3D visual */}
        <div className="relative flex items-center justify-center min-h-[260px]">
          {/* Glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-40 rounded-full bg-g3d-coral/20 blur-3xl" />
          </div>

          <G3DCube />

          {/* Floating chip — processing time */}
          <div className="absolute top-6 right-4 md:right-8 flex items-center gap-2 px-3 py-2 rounded-xl bg-[rgba(247,248,245,0.12)] backdrop-blur border border-[rgba(247,248,245,0.2)] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            Elaborato in 3m 24s
          </div>

          {/* Floating chip — photos */}
          <div className="absolute bottom-6 left-4 md:left-8 px-3 py-2 rounded-xl bg-[rgba(247,248,245,0.12)] backdrop-blur border border-[rgba(247,248,245,0.2)] text-xs font-mono">
            32 foto → 1 model
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
