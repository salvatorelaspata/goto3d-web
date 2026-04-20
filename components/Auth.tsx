import { Input } from "./forms/Input";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "@/i18n/routing";
import { headers } from "next/headers";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { redirect as nextRedirect } from "next/navigation";

export default async function Auth({ message }: { message?: string }) {
  const t = await getTranslations("auth");

  const signIn = async (formData: FormData) => {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    const locale = (await getLocale()) as Locale;
    if (error) {
      return redirect({ href: "/login?message=Could not authenticate user", locale });
    }
    return redirect({ href: "/", locale });
  };

  const signInWithGoogle = async () => {
    "use server";
    const supabase = await createClient();
    const origin = (await headers()).get("origin");
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
    const locale = (await getLocale()) as Locale;
    if (error) {
      return redirect({ href: "/login?message=Could not authenticate user", locale });
    }
    return nextRedirect(data.url);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-palette2 p-4 text-palette1 shadow-md">
      <div className="my-8">
        <h1 className="text-center text-2xl font-bold text-palette1">
          {t("title")}
        </h1>
        <Image src="/logo.png" alt="Config.Reality" width={200} height={200} />
      </div>
      {message && (
        <p className="mb-4 rounded-md bg-red-100 p-3 text-center text-sm text-red-700">
          {message}
        </p>
      )}
      <form className="flex w-full flex-col" action={signIn}>
        <Input id="email" type="text" label={t("email")} name="email" required />
        <Input
          id="password"
          type="password"
          label={t("password")}
          name="password"
          required
        />
        <button
          className="mt-4 rounded-md bg-palette1 p-2 text-palette3"
          type="submit"
        >
          {t("signIn")}
        </button>
        <button
          className="mt-4 rounded-md border border-dotted border-palette1 p-2 text-palette1"
          type="submit"
        >
          {t("signUp")}
        </button>
      </form>

      <div className="relative flex w-full items-center p-4">
        <div className="flex-grow border-t border-palette3"></div>
        <span className="mx-4 flex-shrink text-palette3">{t("or")}</span>
        <div className="flex-grow border-t border-palette3"></div>
      </div>

      <form
        className="flex w-full flex-col px-4 pb-4"
        action={signInWithGoogle}
      >
        <button className="flex cursor-pointer flex-col items-center">
          <Image
            id="google"
            src="/google-logo.png"
            alt={t("signInWithGoogle")}
            width={64}
            height={64}
            className="my-2 cursor-pointer rounded-full bg-palette3 dark:bg-palette2 p-2 shadow-md"
          />
          <p className="my-2 text-palette1">{t("signInWithGoogle")}</p>
        </button>
      </form>
    </div>
  );
}
