"use client";

import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import { Menu } from "../Menu";
import { useTranslations } from "next-intl";
import { HomeIcon, LogoutIcon } from "@heroicons/react/outline";
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
  <li className="flex items-center"> {children}</li>
);

export const Header: React.FC<HeaderProps> = ({ name }) => {
  const path = usePathname();
  const t = useTranslations("nav");
  let color = "bg-palette1 text-palette3 hover:bg-palette2 hover:text-palette3";
  if (path.startsWith("/catalogs"))
    color = "bg-palette4 text-palette1 hover:bg-palette1 hover:text-palette4";
  if (path.startsWith("/artifact")) return null;

  const routes = [
    { name: t("dashboard"), url: "/dashboard" as const },
    { name: t("projects"), url: "/projects" as const },
    { name: t("catalogs"), url: "/catalogs" as const },
    { name: t("configurator"), url: "/configurator" as const },
  ];

  return (
    <>
      <header className="mx-4 mt-4">
        <div className="flex h-10 justify-between">
          <Li>
            <Link
              rel="noopener noreferrer"
              href="/"
              aria-label="Back to homepage"
              className="flex items-center"
            >
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="h-auto w-auto"
              />
            </Link>
            <p className="ml-2 text-sm">{t("hey", { name: name || "" })}</p>
          </Li>

          <ul className="flex items-center space-x-4">
            <div className="hidden items-stretch space-x-3 md:flex">
              {routes.map((item) => (
                <Li key={item.name}>
                  <Link
                    rel="noopener noreferrer"
                    href={item.url}
                    className={`${color} rounded-md px-4 py-2`}
                  >
                    {item.name || ""}
                  </Link>
                </Li>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <LocaleSwitcher />
              <ThemeToggle />
              <form action={navTo}>
                <input type="hidden" name="url" value="/" />
                <button
                  type="submit"
                  className={`${color} rounded-full p-2`}
                  aria-label={t("home")}
                >
                  <HomeIcon className="h-5 w-5" />
                </button>
              </form>
              <form action={logout}>
                <button
                  type="submit"
                  className={`${color} rounded-full bg-palette5 p-2`}
                  aria-label={t("logout")}
                >
                  <LogoutIcon className="h-5 w-5" />
                </button>
              </form>
            </div>
            <div className="flex items-stretch space-x-3 md:hidden">
              <Li>
                <Menu color={color} />
              </Li>
            </div>
          </ul>
        </div>
      </header>
    </>
  );
};
