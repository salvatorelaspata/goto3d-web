import '@/styles/globals.css'
import { Database } from '@/types/supabase'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { Session } from '@supabase/supabase-js'
import type { AppProps } from 'next/app'

const supabaseClient = createBrowserSupabaseClient<Database>()

interface AppPropsWithInitialSession extends AppProps { pageProps: { initialSession: Session } }

export default function App({ Component, pageProps }: AppPropsWithInitialSession) {
  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}