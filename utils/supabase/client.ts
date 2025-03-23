import type { Database } from "@/types/supabase";
import { createBrowserClient } from "@supabase/ssr";

export const createClient = (token?: string) =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    (token ? {
      global: {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      }
    } : {})
  );
