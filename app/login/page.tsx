import Auth from "@/components/Auth";
import { redirect } from "next/navigation";

export default async function Login() {
  const onBack = async () => {
    "use server";
    redirect("/");
  };
  return (
    <div className="flex flex-col items-stretch p-4">
      {/* back button */}
      <form action={onBack}>
        <button className="absolute left-8 top-8 rounded-md bg-palette1 p-2 text-palette5">
          🏚️
        </button>
      </form>
      <Auth />
    </div>
  );
}
export const runtime = "edge";
