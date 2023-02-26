import BaseLayout from '@/components/layout/BaseLayout'
import Table from '@/components/Table'
import { Database } from '@/types/supabase'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
interface ProjectProps {
    projects: Database['public']['Tables']['Project']['Row'][]
}
const Project: React.FC<ProjectProps> = ({ projects }) => {
    return (
        <BaseLayout title="Project">
            <Link href="/projects/new" className='bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded'>
                New Project
            </Link>
            <Table data={projects} />
        </BaseLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createServerSupabaseClient<Database>(context)
    const { data, error } = await supabase
        .from('Project')
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