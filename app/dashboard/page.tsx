import { Dashboard } from "@/components/Dashboard";
import { protectedRoute } from "../projects/actions";

export default async function Home() {
  await protectedRoute();
  return (
    <div className="m-4 flex flex-col items-stretch">
      {/* <div className="w-full p-4 mb-4 bg-palette5 text-palette3 rounded-xl"> */}
      <Dashboard />
      {/* </div> */}
    </div>
  );
}
