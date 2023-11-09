import BaseLayout from "@/components/layout/BaseLayout"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"

const Project: React.FC<{
  project: any
}> = ({ project }) => {
  const { query: { id } } = useRouter()
  return (
    <BaseLayout title="Project">
      <h1>Project {id}</h1>
      <pre>{JSON.stringify(project, null, 2)}</pre>
    </BaseLayout>
  )
}


export default Project

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query
  const supabase = createServerSupabaseClient(context)
  const { data: project, error } =
    await supabase.from('Project')
      .select('*, File(*)')
      .eq('id', id)
      .single()

  if (error) {
    console.log('error', error)
    return {
      notFound: true,
    }
  }
  return {
    props: {
      project,
    },
  }
}