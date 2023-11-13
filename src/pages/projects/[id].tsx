import { Viewer } from '@/components/Viewer'
import BaseLayout from "@/components/layout/BaseLayout"
import { Database } from '@/types/supabase'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"

const Project: React.FC<{
  _project: Database['public']['Tables']['Project']['Row'],
  _process: Database['public']['Tables']['Process']['Row'],
  models: any,
  objUrl: string
}> = ({ objUrl }) => {
  const { query: { id } } = useRouter()
  return (
    <BaseLayout title="Project">
      <h1>Project {id}</h1>
      <Viewer objectUrl={objUrl} />
    </BaseLayout>
  )
}


export default Project

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query
  const supabase = createServerSupabaseClient<Database>(context)
  try {
    // una sorta di innerjoin .-.
    const [{ data: _project }, { data: _process }] = await Promise.all([
      supabase.from('Project').select('id, status, name, description, file_location').eq('id', id).single(),
      supabase.from('Process').select('models_url, detail, order, feature, created_at, finished_at').eq('project_id', id).single(),
    ])
    // get list of models in a folder (file_location)
    const { data: models } = await supabase.storage.from('viewer3d-dev').list(`${_project?.file_location}`)
    // get the obj file name
    const objName: string = models?.find((m) => m.name.endsWith('.obj'))?.name || ''
    // get the signed url for the obj file
    const { data } = await supabase.storage.from('viewer3d-dev').createSignedUrl(`${_project?.file_location}${objName}`, 60)
    return {
      props: { _project, _process, models, objUrl: data?.signedUrl }
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}