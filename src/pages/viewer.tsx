import Form from '@/components/forms/Form'
import { Viewer } from '@/components/Viewer'
import { ModelLayout } from '@/components/layout/ModelLayout'
import { Database } from '@/types/supabase'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSideProps } from "next"

const ViewerPage: React.FC<{
  objUrl: string,
  textureUrl: string,
  backgroundUrl: string
}> = ({ objUrl, textureUrl, backgroundUrl }) => {
  return (
    <>
      <ModelLayout>
        {objUrl && <Viewer objUrl={objUrl} textureUrl={textureUrl} backgroundUrl={backgroundUrl} />}
      </ModelLayout>
    </>
  )
}

export default ViewerPage

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query
  const _id: number = parseInt(id as string)
  const supabase = createServerSupabaseClient<Database>(context)
  try {
    // una sorta di innerjoin .-.
    const { data: _project } = await supabase.from('Project')
      .select('id, status, name, description, file_location')
      .eq('id', _id)
      .single()
    const { data: _process } = await supabase.from('Process')
      .select('*')
      .eq('project_id', _id)
      .single()
    // console.log(_project, _process, _id)
    // get list of models in a folder (file_location) & list of backgrounds
    const { data: models } = await supabase.storage.from('viewer3d-dev').list(`${_project?.file_location}`)
    const { data: backgrounds } = await supabase.storage.from('viewer3d-dev').list('HDR')

    // get the obj file name, the texture file name and a random background
    const objName: string = models?.find((m) => m.name.endsWith('.obj'))?.name || ''
    const textureName: string = models?.find((m) => m.name === 'baked_mesh_tex0.png')?.name || ''
    const backgroundName: string = backgrounds && backgrounds.length > 0 ? backgrounds[Math.floor(Math.random() * backgrounds.length)]?.name : ''
    let objUrl: string | undefined = ''
    let textureUrl: string | undefined = ''
    let backgroundUrl: string | undefined = ''
    // get the signed url for the obj file
    try {
      const { data: _objUrl } = await supabase.storage.from('viewer3d-dev').createSignedUrl(`${_project?.file_location}${objName}`, 2);
      objUrl = _objUrl?.signedUrl;
      const { data: _textureUrl } = await supabase.storage.from('viewer3d-dev').createSignedUrl(`${_project?.file_location}${textureName}`, 2);
      textureUrl = _textureUrl?.signedUrl;
      const { data: _backgroundUrl } = await supabase.storage.from('viewer3d-dev').createSignedUrl(`HDR/${backgroundName}`, 2);
      backgroundUrl = _backgroundUrl?.signedUrl;
    } catch (error) { console.log('error', error) }

    // console.log(objUrl, textureUrl, backgroundUrl)

    return {
      props: { _project, _process, models, objUrl: objUrl || null, textureUrl: textureUrl || null, backgroundUrl: backgroundUrl || null}
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}