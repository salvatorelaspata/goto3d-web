import BaseLayout from '@/components/layout/BaseLayout'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Card } from "../components/Card"
import styles from "../styles/Landing.module.css"
interface Props {
    user: any
}
const Home: React.FC<Props> = ({ user }) => {
    const supabaseClient = useSupabaseClient()
    const router = useRouter()
    useEffect(() => {
        supabaseClient.auth.onAuthStateChange((event, session) => {
            console.log(event, session)
            router.push('/dashboard')
        })
    }, [router, supabaseClient.auth])
    return (
        <BaseLayout title="">
            {!user ? <div className='p-10'><Auth
                redirectTo="http://localhost:3000/dashboard"
                appearance={{ theme: ThemeSupa }}
                supabaseClient={supabaseClient}
                providers={['google']}
                socialLayout="horizontal"
            /></div> : null}
            <div className='grid grid-cols-2'>
                <p className={styles.instructions}>
                    <span><strong className="text-3xl">Config.Reality</strong> ti permette di creare il tuo modello 3d partendo da delle foto</span>
                    <br />
                    <span className="text-xl"><strong>crea</strong></span> Il tuo progetto.<br />
                    <strong>Scegli le tue foto </strong> per procedere alla creazione del tuo modello <code>3D</code>. <br />
                    <strong>Genera</strong> il tuo modello <strong>3D</strong> e <strong>scaricalo</strong> in formato <code>.obj</code>. <br />
                    <strong>Pubblica</strong> il tuo catalogo <code>privato</code> o <code>pubblico</code> per condividerlo con chi hai voglia.
                </p>
                <ul role="list" className={styles['link-card-grid']}>
                    <div className="justify-between">
                        <Card
                            href="/projects/create"
                            title="Crea il Progetto"
                            body="🫥"
                        />
                        <Card
                            href="https://astro.build/integrations/"
                            title="Genera il Modello"
                            body="♺"
                        />
                    </div>
                    <div className="justify-between">
                        <Card
                            href="https://astro.build/themes/"
                            title="Crea il catalogo"
                            body="📦"
                        />
                        <Card
                            href="https://astro.build/chat/"
                            title="Condividi il catalogo"
                            body="❤️"
                        />
                    </div>
                </ul>
            </div>
            <div className="p-6 py-12 dark:bg-violet-400 dark:text-gray-900">
                <div className="container mx-auto">
                    <div className="flex flex-col lg:flex-row items-center justify-between">
                        <h2 className="text-center text-6xl tracking-tighter font-bold">Suvvia¿ cosa aspetti ?
                            <br className="sm:hidden" /><span className="underline text-white text-4xl">Affrettati</span>
                        </h2>
                        <a href="#" rel="noreferrer noopener" className="px-5 mt-4 lg:mt-0 py-3 rounded-md border block dark:bg-gray-50 dark:text-gray-900 dark:border-gray-400">Configura</a>
                    </div>
                </div>
            </div>
        </BaseLayout>

    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
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
    return {
        props: {
            user: null
        }
    }
}

export default Home