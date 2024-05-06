// Creating a new supabase server client object (e.g. in API route):
import { Database } from "@/types/supabase";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabaseServerClient = createPagesServerClient<Database>({
    req,
    res,
  });
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();

  res.status(200).json({ ...(user ?? "") });
}
