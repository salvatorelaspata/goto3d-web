import { Database } from '@/types/supabase'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

// create signout next api to log out supabase user
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabaseServerClient = createServerSupabaseClient<Database>({
    req,
    res,
  })
  const { error } = await supabaseServerClient.auth.signOut()
  if (error) return res.status(401).json({ error: error.message })
  // redirect to home page
  res.redirect('/').end()
}
