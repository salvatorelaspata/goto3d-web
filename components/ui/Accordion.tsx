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
            className="accordion py-4 px-6 mb-7 transition-all duration-500 bg-gray-50 rounded-2xl hover:bg-indigo-50 accordion-active:bg-indigo-50"
            id={`${"basic-heading-one-with-arrow" + index}`}
          >
            <button
              className="accordion-toggle group  inline-flex items-center justify-between leading-8 text-gray-900  w-full transition duration-500 text-left hover:text-indigo-600 accordion-active:text-indigo-600"
              aria-controls="basic-collapse-one-with-arrow"
            >
              <h5> {item.title} </h5>
              <svg
                className="text-gray-500 transition duration-500 group-hover:text-indigo-600 accordion-active:text-indigo-600 accordion-active:rotate-180"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.5 8.25L12.4142 12.3358C11.7475 13.0025 11.4142 13.3358 11 13.3358C10.5858 13.3358 10.2525 13.0025 9.58579 12.3358L5.5 8.25"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </button>
            <div
              id="basic-collapse-one-with-arrow"
              className="accordion-content  w-full px-0 overflow-hidden"
              aria-labelledby={`${"basic-heading-one-with-arrow" + index}`}
            >
              <p className="text-base text-gray-900 leading-6">
                {item.content}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}
