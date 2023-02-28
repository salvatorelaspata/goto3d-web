import BaseLayout from "@/components/layout/BaseLayout"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { GetServerSideProps } from "next"

interface Props {
    user: any
}

const Landing: React.FC<Props> = ({ user }) => {
    return (
        <BaseLayout title="">
            <pre>
                {JSON.stringify(user, null, 2)}
            </pre>
        </BaseLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    debugger;
    const supabase = createServerSupabaseClient(ctx)
    const {
        data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            user: session?.user
        }
    }
}


export default Landing