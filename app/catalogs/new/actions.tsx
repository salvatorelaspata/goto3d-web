"use server";
import { createClient } from "@/utils/supabase/server";

export async function doCreate(formData: FormData) {
  const supabase = createClient();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const _public = formData.get("public") === "true";
  const { data, error } = await supabase
    .from("catalog")
    .insert({
      title,
      description,
      public: _public,
    })
    .select("id")
    .single();
  if (error) {
    throw new Error(error.message);
  }
}
