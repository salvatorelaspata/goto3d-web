"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "./MenuActions";
gsap.registerPlugin(useGSAP);

const ItemMenu: React.FC<{
  href: string;
  text: string;
}> = ({ href, text }) => {
  const link = (
    <Link
      href={href || "#"}
      className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
    >
      {text}
    </Link>
  );
  return link;
};

const ItemMenuLogout: React.FC = () => {
  return (
    <form
      action={logout}
      className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
    >
      <button>Logout</button>
    </form>
  );
};

export const Menu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useGSAP(() => {
    gsap.to(".avatar-menu", {
      opacity: 1,
      scale: 1,
    });
  });

  const toggleButton = () => {
    setIsOpen(!isOpen);
  };
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
      {isOpen && (
        <div className="absolute right-0 z-20 w-48 mt-2 origin-top-right bg-palette1 rounded">
          <ItemMenu href="/profile" text="Profilo" />
          <ItemMenu href="/projects" text="Progetti" />
          <ItemMenu href="/catalogs" text="Cataloghi" />
          <ItemMenu href="/faq" text="Help (FAQ)" />
          {/* <ItemMenu href="#" text="Impostazioni" /> */}
          <ItemMenuLogout />
          {/* <ItemMenu href="#" text="Logout" logout /> */}
        </div>
      )}
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
