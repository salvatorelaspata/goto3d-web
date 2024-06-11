"use client";
import { useRef, useState } from "react";
import { logout, navTo } from "./MenuActions";
import { privateRoutes } from "@/utils/constants";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const ItemMenu: React.FC<{
  href: string;
  text: string;
}> = ({ href, text }) => {
  const link = (
    <form
      action={navTo}
      className="block text-sm text-palette3 capitalize transition-colors duration-300 transform hover:bg-palette2"
    >
      <input type="hidden" name="url" value={href} />
      <button className="w-full px-4 py-3">{text}</button>
    </form>
  );
  return link;
};

const ItemMenuLogout: React.FC = () => {
  return (
    <form
      action={logout}
      className="block text-sm text-palette3 capitalize transition-colors duration-300 transform hover:bg-palette2"
    >
      <button className="w-full px-4 py-3">Logout</button>
    </form>
  );
};

export const Menu: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const container = useRef(null);
  const { contextSafe } = useGSAP({ scope: container }); // we can pass in a config object as the 1st parameter to make scoping simple
  const ref = useRef(null);

  const toggleButton = contextSafe(() => {
    setIsOpen(!isOpen);
    const tm = gsap.timeline();
    tm.to(ref.current, {
      duration: 0.5,
      animation: "ease-in-out",
      opacity: !isOpen ? 0 : 1,
      display: !isOpen ? "none" : "block",
      visibility: !isOpen ? "" : "visible",
    });
    tm.to(ref.current, {
      visibility: !isOpen ? "hidden" : "",
    });
  });
  return (
    <div className="relative inline-block">
      {/* Dropdown toggle button */}
      <button
        onClick={toggleButton}
        className="relative z-10 block p-2 text-palette1 bg-palette2 border border-transparent rounded-md focus:border-primary1 focus:ring-opacity-40  focus:ring-palette1 focus:ring focus:outline-none"
      >
        {icon}
      </button>

      {/* Dropdown menu */}
      <div ref={container}>
        <div
          ref={ref}
          className="hidden absolute right-0 z-20 w-48 mt-4 origin-top-right bg-palette1 rounded-lg border-palette5 border"
        >
          {privateRoutes.map((item) => (
            <ItemMenu key={item.name} href={item.url} text={item.name} />
          ))}
          <ItemMenuLogout />
        </div>
      </div>
    </div>
  );
};

const icon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 18L20 18"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M4 12L20 12"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M4 6L20 6"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
