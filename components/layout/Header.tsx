"use client";

import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import { Menu } from "../Menu";
import { useTranslations } from "next-intl";
import { logout, navTo } from "../MenuActions";
import { ThemeToggle } from "../ThemeToggle";
import { LocaleSwitcher } from "../LocaleSwitcher";

interface HeaderProps {
  name: string | undefined;
}

interface LiProps {
  children: React.ReactNode;
}

const Li: React.FC<LiProps> = ({ children }) => (
  <li className="flex items-center">{children}</li>
);

export const Header: React.FC<HeaderProps> = ({ name }) => {
  const path = usePathname();
  const t = useTranslations("nav");

  if (path.startsWith("/artifact")) return null;

  const routes = [
    { name: t("dashboard"), url: "/dashboard" as const },
    { name: t("projects"), url: "/projects" as const },
    { name: t("catalogs"), url: "/catalogs" as const },
    { name: t("configurator"), url: "/configurator" as const },
  ];

  const isActive = (url: string) => path.startsWith(url);

  return (
    <header className="sticky top-0 z-40 bg-g3d-card border-b border-g3d-border">
      <div className="flex h-12 items-center justify-between px-4 md:px-6">
        {/* Left: logo + greeting */}
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="Back to homepage" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="goto3d logo"
              width={28}
              height={28}
              className="h-auto w-auto"
            />
            <span className="font-bold text-sm text-g3d-fg tracking-tight">
              goto<span className="text-g3d-coral">3d</span>
            </span>
          </Link>
          {name && (
            <span className="hidden sm:block text-xs text-g3d-muted font-mono">
              {t("hey", { name: name.split("@")[0] })}
            </span>
          )}
        </div>

        {/* Center: nav links */}
        <ul className="hidden md:flex items-center gap-1">
          {routes.map((item) => (
            <Li key={item.name}>
              <Link
                href={item.url}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.url)
                    ? "bg-g3d-teal-light text-g3d-teal dark:bg-g3d-teal/20 dark:text-[#5FB8B8]"
                    : "text-g3d-muted hover:text-g3d-fg hover:bg-g3d-neutral"
                }`}
              >
                {item.name}
              </Link>
            </Li>
          ))}
        </ul>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />

          <form action={navTo}>
            <input type="hidden" name="url" value="/" />
            <button
              type="submit"
              className="p-1.5 rounded-md text-g3d-muted hover:text-g3d-fg hover:bg-g3d-neutral transition-colors"
              aria-label={t("home")}
            >
              <HomeIcon />
            </button>
          </form>

          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-g3d-coral text-white hover:bg-g3d-coral-hover transition-colors"
              aria-label={t("logout")}
            >
              <LogoutIcon />
              <span className="hidden sm:inline">{t("logout")}</span>
            </button>
          </form>

          {/* Mobile: hamburger */}
          <div className="flex items-center md:hidden">
            <Menu color="" />
          </div>
        </div>
      </div>
    </header>
  );
};

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12L12 3l9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}
