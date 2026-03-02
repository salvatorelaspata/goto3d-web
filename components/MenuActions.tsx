"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";

export const logout = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  const locale = (await getLocale()) as Locale;
  return redirect({ href: "/", locale });
};

export const navTo = async (formData: FormData) => {
  const url = (formData.get("url") as string) || "/";
  const locale = (await getLocale()) as Locale;
  return redirect({ href: url, locale });
};
