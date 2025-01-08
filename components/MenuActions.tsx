"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const logout = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
};

export const navTo = async (e: FormData) => {
  const url = (e.get("url") as string) || "/";
  return redirect(url);
};
