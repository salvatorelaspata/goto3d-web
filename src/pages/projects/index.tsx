import BaseLayout from '@/components/layout/BaseLayout'
import Table from '@/components/Table'
import { Database } from '@/types/supabase'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
interface ProjectProps {
  projects: Database['public']['Tables']['Project']['Row'][],
  count: number
}
const Project: React.FC<ProjectProps> = ({ projects, count }) => {
  const router = useRouter()
  const supabase = useSupabaseClient()
  
  const onDeleteRow = async (id: string) => {
    try {
      await supabase.from('Process')
        .delete().eq('project_id', id)
          
      await supabase.from('Project')
              .delete().eq('id', id)
      router.push('/projects')  
    } catch (error) {
      console.log('error', error)
    }  
  }

  return (
    <BaseLayout title={`Project (${count})`}>
      <Link href="/projects/new" className='bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded'>
        New Project
      </Link>
      <Table 
        data={projects} 
        onRowClick={
          (row: Database['public']['Tables']['Project']['Row']) => {
            router.push(`/projects/${row.id}`)
          }
        }
        withDelection={true}
        onDeleteRow={onDeleteRow} />
    </BaseLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createServerSupabaseClient<Database>(context)
  const { data: projects, error, count } = await supabase
    .from('Project')
    .select('id, status, name, description', { count: 'exact' })
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