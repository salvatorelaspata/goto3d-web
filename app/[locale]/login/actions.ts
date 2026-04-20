"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "@/i18n/routing";
import { redirect as nextRedirect } from "next/navigation";
import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { authSchema, type AuthState } from "@/lib/validations/auth";

export async function signInAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const result = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return {
      errors: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(result.data);

  if (error) {
    return { message: "signInError" };
  }

  const locale = (await getLocale()) as Locale;
  redirect({ href: "/", locale });
  return {} as AuthState;
}

export async function signUpAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const result = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return {
      errors: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp(result.data);

  if (error) {
    return { message: "signUpError" };
  }

  const locale = (await getLocale()) as Locale;
  redirect({ href: "/", locale });
  return {} as AuthState;
}

export async function signInWithGoogleAction(): Promise<never> {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (error || !data.url) {
    const locale = (await getLocale()) as Locale;
    redirect({ href: "/login?message=Could not authenticate user", locale });
  }

  nextRedirect(data.url!);
}
