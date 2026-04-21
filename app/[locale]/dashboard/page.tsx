import { Dashboard } from "@/components/Dashboard";
import { protectedRoute } from "@/app/[locale]/actions";

export default async function Home() {
  await protectedRoute();
  return <Dashboard />;
}
