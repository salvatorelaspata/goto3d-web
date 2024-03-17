import BaseLayout from '@/components/layout/BaseLayout'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Card } from "../components/Card"
import styles from "../styles/Landing.module.css"
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
interface HomeProps {
  user: any,
  siteUrl: string
}

const Home: React.FC<HomeProps> = ({ user, siteUrl }) => {
  const supabaseClient = useSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log(event, session)
      router.push('/dashboard')
    })
  }, [])
  return (
    <BaseLayout title="" withFooter={true}>
      <p className={styles.instructions}>
        <span><strong className="text-3xl">Config.Reality</strong> ti permette di creare il tuo modello 3d partendo da delle foto</span>
        <br />
        <span className="text-xl"><strong>crea</strong></span> Il tuo progetto.<br />
        <strong>Scegli le tue foto </strong> per procedere alla creazione del tuo modello <code>3D</code>. <br />
        <strong>Genera</strong> il tuo modello <strong>3D</strong> e <strong>scaricalo</strong> in formato <code>.obj</code>. <br />
        <strong>Pubblica</strong> il tuo catalogo <code>privato</code> o <code>pubblico</code> per condividerlo con chi hai voglia.
      </p>
      <ul role="list">
        <Card
          href="#"
          title="Crea il Progetto"
          body="🫥"
          icon="1 ➡️"
        />
        <Card
          href="#"
          title="Genera il Modello"
          body="♺"
          icon="2 ➡️"
        />
        <Card
          href="#"
          title="Crea il catalogo"
          body="📦"
          icon="3 ➡️"
        />
        <Card
          href="#"
          title="Condividi il catalogo"
          body="❤️"
          icon="4 ➡️"
        />
      </ul>
      {!user ? (
        <div className='p-10'>
          <Auth
            redirectTo={siteUrl}
            appearance={{ theme: ThemeSupa }}
            supabaseClient={supabaseClient}
            providers={['google']}
          />
        </div>
      ) : null}
    </BaseLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // retrieve siteurl from env
  const siteUrl = process.env.SITE_URL || 'http://localhost:8080/dashboard'
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session)
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false
      }
    }

  return { props: { user: null, siteUrl } }
}

export default Home