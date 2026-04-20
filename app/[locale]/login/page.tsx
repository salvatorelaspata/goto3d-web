import Auth from "@/components/Auth";
import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;
  const onBack = async () => {
    "use server";
    const locale = (await getLocale()) as Locale;
    redirect({ href: "/", locale });
  };
  return (
    <div className="flex flex-col items-stretch p-4">
      {/* back button */}
      <form action={onBack}>
        <button className="absolute left-8 top-8 rounded-md bg-palette1 p-2 text-palette5">
          🏚️
        </button>
      </form>
      <Auth message={message} />
    </div>
  );
}
