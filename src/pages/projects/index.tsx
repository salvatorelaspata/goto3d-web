import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import BaseLayout from '@/components/layout/BaseLayout'
import {Grid} from '@/components/Grid'
import { ProjectCard } from '@/components/ProjectCard'

interface ProjectProps {
  projects: Database['public']['Tables']['Project']['Row'][],
  count: number
}

const Project: React.FC<ProjectProps> = ({ projects, count }) => {
  return (
    <BaseLayout title={`Project (${count})`}>
      <div className='flex flex-col'>
        <Link className='w-40 text-center p-4 my-4 text-xl bg-violet-500 hover:bg-violet-700 text-white font-bold rounded'
            href="/projects/new" >
          New Project
        </Link>
          <Grid cols={4}>
            {projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
        </Grid>
      </div>
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