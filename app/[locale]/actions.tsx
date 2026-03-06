import { createClient } from "@/utils/supabase/server";
import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";

export const protectedRoute = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const locale = (await getLocale()) as Locale;
    return redirect({ href: "/login", locale });
  }
};
