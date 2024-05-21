import { Dashboard } from "@/components/Dashboard";

export default async function Home() {
  return (
    <div className="m-4 flex flex-col items-stretch">
      <div className="w-full p-4 mb-4 bg-palette5 text-palette3 rounded-xl">
        <Dashboard />
      </div>
    </div>
  );
}
