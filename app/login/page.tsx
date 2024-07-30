import Auth from "@/components/Auth";
import { redirect } from "next/navigation";

export default async function Login () {
  const onBack = async () => {
    "use server";
    redirect("/");
  };
  return (
    <div className="flex flex-col items-stretch p-4">
      {/* back button */}
      <form action={onBack}>
        <button className="absolute  left-8 top-8 bg-palette1 text-palette5 rounded-md p-2">
          🏚️
        </button>
      </form>
      <Auth />
    </div>
  );
}
