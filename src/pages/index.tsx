import { Landing } from '@/components/Landing'
import BaseLayout from '@/components/layout/BaseLayout'
import { createBrowserSupabaseClient, createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { GetServerSideProps } from 'next'
interface Props {
    user: any
}
const Home: React.FC<Props> = ({ user }) => {
    const supabaseClient = createBrowserSupabaseClient()
    if (!user) {
        return (
            <BaseLayout title="Landing">
                <Landing />
                <Auth
                    redirectTo="http://localhost:3000/"
                    appearance={{ theme: ThemeSupa }}
                    supabaseClient={supabaseClient}
                    providers={['google']}
                    socialLayout="horizontal"
                    onlyThirdPartyProviders={true}
                />
            </BaseLayout>
        )
    }

    return (
        <BaseLayout title="UserAuthenticate">
            <p>user:</p>
            <pre>{JSON.stringify(user, null, 2)}</pre>
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