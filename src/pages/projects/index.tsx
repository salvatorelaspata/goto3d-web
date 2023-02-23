import BaseLayout from '@/components/layout/BaseLayout'
import { Constants } from '@/constants'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSideProps } from 'next'
import Link from 'next/link'

const Project: React.FC<{
    projects: any
}> = ({ projects }) => {
    return (
        <BaseLayout title="Project">
            <h1>Project</h1>
            <ul>
                {projects.map((p: any) => (
                    <li key={p.id}>
                        <p>{p.id}</p>
                        <pre>{JSON.stringify(p, null, 2)}</pre>
                        <Link href={`/projects/${p.id}`}>
                            View Project
                        </Link>
                    </li>
                ))}
            </ul>
        </BaseLayout>
    )
}
export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createServerSupabaseClient(context)
    const { data, error } = await supabase
        .from(Constants.projectsTable)
        .select('*')
    if (error) {
        return {
            props: {
                project: [],
            },
        }
    }
    return {
        props: {
            projects: data,
        },
    }
}
export default Project