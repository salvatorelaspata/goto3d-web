"use client";
import { useRef, useState } from "react";
import { logout, navTo } from "./MenuActions";
import { routes } from "@/utils/constants";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface MenuProps {
  color: string;
}

export const Menu: React.FC<MenuProps> = ({ color }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const container = useRef(null);
  const { contextSafe } = useGSAP({ scope: container }); // we can pass in a config object as the 1st parameter to make scoping simple
  const ref = useRef(null);

  const showMenu = contextSafe(() => {
    const tm = gsap.timeline();
    tm.to(ref.current, {
      duration: 0.5,
      animation: "ease-in-out",
      opacity: 1,
      display: "block",
      visibility: "visible",
    });
  });
  const hideMenu = contextSafe(() => {
    const tm = gsap.timeline();
    tm.to(ref.current, {
      duration: 0.5,
      animation: "ease-in-out",
      opacity: 0,
      display: "none",
      visibility: "hidden",
    });
  });

  const toggleButton = contextSafe(() => {
    setIsOpen(!isOpen);
    if (isOpen) hideMenu();
    else showMenu();
  });

  return (
    <div className="relative inline-block">
      {/* Dropdown toggle button */}
      <button
        onClick={toggleButton}
        className={`${color} focus:border-primary1 relative z-30 block rounded-md border border-transparent p-2`}
      >
        {icon}
      </button>

      {/* Dropdown menu */}
      <div ref={container}>
        <div
          ref={ref}
          className="absolute right-0 z-30 mt-4 hidden w-48 origin-top-right rounded-lg border"
        >
          {routes.map((item) => (
            <form
              action={navTo}
              className={`block text-sm ${color}`}
              key={item.name}
            >
              <input type="hidden" name="url" value={item.url} />
              <button className="w-full px-4 py-3">{item.name}</button>
            </form>
          ))}

          <form action={logout} className={`${color} block text-sm`}>
            <button className="w-full px-4 py-3">Logout</button>
          </form>
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
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 18L20 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M4 12L20 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M4 6L20 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
