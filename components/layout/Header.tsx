"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "../Menu";
import { routes } from "@/utils/constants";
import { usePathname } from "next/navigation";

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
  let color = "bg-palette1 text-palette3 hover:bg-palette2 hover:text-palette3";
  if (path.startsWith("/catalogs"))
    color = "bg-palette4 text-palette1 hover:bg-palette1 hover:text-palette4";
  if (path.startsWith("/artifact")) return null;
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
            <p className="ml-2 text-sm">Hey {name}</p>
          </Li>

          <ul>
            <div className="hidden items-stretch space-x-3 md:flex">
              {routes.map((item) => (
                <Li key={item.name}>
                  <Link
                    rel="noopener noreferrer"
                    href={item.url}
                    className={`${color} rounded-md py-2 px-4`}
                  >
                    {item.name || ""}
                  </Link>
                </Li>
              ))}
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
