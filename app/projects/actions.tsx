import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const protectedRoute = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }
};
