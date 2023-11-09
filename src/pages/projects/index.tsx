import BaseLayout from '@/components/layout/BaseLayout'
import Table from '@/components/Table'
import { Database } from '@/types/supabase'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
interface ProjectProps {
    projects: Database['public']['Tables']['Project']['Row'][],
    count: number
}
const Project: React.FC<ProjectProps> = ({ projects, count }) => {
    const router = useRouter()
    return (
        <BaseLayout title={`Project (${count})`}>
            <Link href="/projects/new" className='bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded'>
                New Project
            </Link>
            <Table data={projects} onRowClick={
                (row: Database['public']['Tables']['Project']['Row']) => {
                    router.push(`/projects/${row.id}`)
                }
            } />
        </BaseLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createServerSupabaseClient<Database>(context)
    const { data: projects, error, count } = await supabase
        .from('Project')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
    if (error) {
        return {
            props: {
                project: [],
                count: 0
            },
        }
    }
    return {
        props: {
            projects,
            count
        },
    }
}
export default Project