import { Dashboard } from "@/components/Dashboard";
import { protectedRoute } from "@/app/actions";

export default async function Home() {
  await protectedRoute();
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* <div className="w-full p-4 mb-4 bg-palette5 text-palette3 rounded-xl"> */}
      <Dashboard />
      {/* </div> */}
    </div>
  );
}
