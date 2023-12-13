import { Viewer } from '@/components/Viewer'
import BaseLayout from "@/components/layout/BaseLayout"
import { Database } from '@/types/supabase'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"

const Project: React.FC<{
  _project: Database['public']['Tables']['Project']['Row'],
  _process: Database['public']['Tables']['Process']['Row'],
  objUrl: string,
  textureUrl: string,
  backgroundUrl: string
}> = ({ objUrl, textureUrl, backgroundUrl }) => {
  const { query: { id } } = useRouter()
  return (
    <BaseLayout title={`Project ${id}`}>
      <Viewer
        objUrl={objUrl}
        textureUrl={textureUrl}
        backgroundUrl={backgroundUrl}
      />
    </BaseLayout>
  )
}

export default Project

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query
  const _id: number = parseInt(id as string)
  const supabase = createServerSupabaseClient<Database>(context)
  try {
    // una sorta di innerjoin .-.
    const [{ data: _project }, { data: _process }] = await Promise.all([
      supabase.from('Project').select('id, status, name, description, file_location').eq('id', _id).single(),
      supabase.from('Process').select('models_url, detail, order, feature, created_at, finished_at').eq('project_id', _id).single(),
    ])
    // get list of models in a folder (file_location) & list of backgrounds
    const { data: models } = await supabase.storage.from('viewer3d-dev').list(`${_project?.file_location}`)
    const { data: backgrounds } = await supabase.storage.from('viewer3d-dev').list('HDR')

    // get the obj file name, the texture file name and a random background
    const objName: string = models?.find((m) => m.name.endsWith('.obj'))?.name || ''
    const textureName: string = models?.find((m) => m.name === 'baked_mesh_tex0.png')?.name || ''
    const backgroundName: string = backgrounds && backgrounds.length > 0 ? backgrounds[Math.floor(Math.random() * backgrounds.length)]?.name : ''

    // get the signed url for the obj file
    const { data: objUrl } = await supabase.storage.from('viewer3d-dev').createSignedUrl(`${_project?.file_location}${objName}`, 60)
    const { data: textureUrl } = await supabase.storage.from('viewer3d-dev').createSignedUrl(`${_project?.file_location}${textureName}`, 60)
    const { data: backgroundUrl } = await supabase.storage.from('viewer3d-dev').createSignedUrl(`HDR/${backgroundName}`, 60)

    console.log(objUrl, textureUrl, backgroundUrl)
    return {
      props: { _project, _process, models, objUrl: objUrl?.signedUrl, textureUrl: textureUrl?.signedUrl, backgroundUrl: backgroundUrl?.signedUrl }
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}