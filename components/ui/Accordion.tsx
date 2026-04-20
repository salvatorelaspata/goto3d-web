import { useEffect, useState } from "react";

interface AccordionProps {
  items: {
    title: string;
    content: string;
  }[];
}
export default function Accordion({ items }: AccordionProps) {
  return (
    <div className="accordion-group " data-accordion="default-accordion">
      {items &&
        items.map((item, index) => (
          <div
            key={index}
            className="accordion py-4 px-6 mb-7 transition-all duration-500 bg-palette3 dark:bg-palette2/40 rounded-2xl hover:bg-palette2/20 dark:hover:bg-palette2/60 accordion-active:bg-palette2/20 dark:accordion-active:bg-palette2/60"
            id={`${"basic-heading-one-with-arrow" + index}`}
          >
            <button
              className="accordion-toggle group inline-flex items-center justify-between leading-8 text-palette1 w-full transition duration-500 text-left hover:text-palette5 accordion-active:text-palette5"
              aria-controls="basic-collapse-one-with-arrow"
            >
              <h5> {item.title} </h5>
              <svg
                className="text-palette1/60 transition duration-500 group-hover:text-palette5 accordion-active:text-palette5 accordion-active:rotate-180"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.5 8.25L12.4142 12.3358C11.7475 13.0025 11.4142 13.3358 11 13.3358C10.5858 13.3358 10.2525 13.0025 9.58579 12.3358L5.5 8.25"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </button>
            <div
              id="basic-collapse-one-with-arrow"
              className="accordion-content  w-full px-0 overflow-hidden"
              aria-labelledby={`${"basic-heading-one-with-arrow" + index}`}
            >
              <p className="text-base text-palette1 leading-6">
                {item.content}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}
