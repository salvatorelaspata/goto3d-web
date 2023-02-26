import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from './types/supabase'

export async function middleware(req: NextRequest) {
  // We need to create a response and hand it to the supabase client to be able to modify the response headers.
  const res = NextResponse.next()
  // Create authenticated Supabase Client.
  const supabase = createMiddlewareSupabaseClient<Database>({ req, res })
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check auth condition
  if (
    session?.user.email?.endsWith('@gmail.com') ||
    session?.user.email?.endsWith('@cubemail.it') ||
    session?.user.email?.endsWith('@gotonext.it')
  ) {
    console.log(`User is authenticated.`)
    // Authentication successful, forward request to protected route.
    return res
  }

  // Auth condition not met, redirect to home page.
  const redirectUrl = req.nextUrl.clone()
  redirectUrl.pathname = '/'
  redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname)
  return NextResponse.redirect(redirectUrl)
}

export const config = {
  matcher: [
    '/profile/',
    '/projects/:path*',
    '/projects/',
    '/catalogs/:path*',
    '/catalogs/',
  ],
}
