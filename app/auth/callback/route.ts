import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { defaultLocale } from "@/i18n/config";

export const runtime = "edge";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  // Try to get locale from cookie, fallback to default
  const cookieHeader = request.headers.get("cookie") || "";
  const localeMatch = cookieHeader.match(/NEXT_LOCALE=(\w+)/);
  const locale = localeMatch?.[1] || defaultLocale;

  if (!code) {
    return NextResponse.redirect(`${origin}/${locale}/login?error=missing_code`);
  }

  const supabase = createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/${locale}/login?error=auth_callback_failed`);
  }

  return NextResponse.redirect(`${origin}/${locale}/dashboard`);
}
