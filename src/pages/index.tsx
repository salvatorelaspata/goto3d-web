import { Landing } from '@/components/Landing'
import { createBrowserSupabaseClient, createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { GetServerSideProps } from 'next'
interface Props {
  user: any
}
const Home: React.FC<Props> = ({ user }) => {
  const supabaseClient = createBrowserSupabaseClient()
  if (!user) {
    console.log('no session')
    return (
      <div className="container" style={{ padding: '50px 0 100px 0' }}>
        <Landing />
        <Auth
          redirectTo="http://localhost:3000/"
          appearance={{ theme: ThemeSupa }}
          supabaseClient={supabaseClient}
          providers={['google']}
          socialLayout="horizontal"
        />
      </div>
    )
  }
  console.log('session', user)
  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      <button onClick={() => supabaseClient.auth.signOut()}>Sign out</button>
      <p>user:</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return {
    props: {
      initialSession: null,
      user: null
    }
  }

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  }
}

export default Home