import { Step } from "./Step";

interface LegendProps {
  children: React.ReactNode;
  title: string;
  step: number;
}

export const Legend: React.FC<LegendProps> = ({ children, title, step }) => (
  <>
    <div className="h-full bg-white text-black rounded-r-xl p-4 border-gray-600 border">
      <div className="w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse dark:bg-gray-600 dark:text-gray-100 p-4 rounded-xl">
        <Step title={title} step={step} />
      </div>
      {children}
    </div>
  </>
);
