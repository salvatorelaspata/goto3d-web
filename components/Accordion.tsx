"use client";
import { useState } from "react";

export const Accordion: React.FC<{ title: string; content: string }> = ({
  title,
  content,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [icon, setIcon] = useState(openIcon);

  return (
    <div className="w-full border-palette1 border border-dashed rounded-md">
      <button
        className="flex justify-between w-full p-4 bg-palette3 text-palette1 font-bold "
        onClick={() => {
          setIsOpen(!isOpen);
          setIcon(isOpen ? openIcon : closeIcon);
        }}
      >
        <h2 className="text-2xl">{title}</h2>
        <span className="text-2xl">{icon}</span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <p className="p-3 bg-palette2 text-palette1">{content}</p>
      </div>
    </div>
  );
};

const closeIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 shrink-0 transition-transform duration-200"
  >
    <path d="m6 9 6 6 6-6"></path>
  </svg>
);

const openIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 shrink-0 transition-transform duration-200"
  >
    <path d="m18 15-6-6-6 6"></path>
  </svg>
);
