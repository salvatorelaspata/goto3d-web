import Form from "@/components/forms/Form";
import { FormProject } from "@/components/forms/FormProject";
import BaseLayout from "@/components/layout/BaseLayout";
import { actions } from "@/store/main";
import { Database } from "@/types/supabase";
import { filesToTable, formFields } from "@/utils/constants";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSideProps } from "next";
import { toast } from "react-toastify";

const NewProject: React.FC = () => {
  const supabase = useSupabaseClient<Database>()

  const fields = formFields
  
  const onSubmit = async ({ name, description, files, detail, order, feature }: any) => {
    
    actions.showLoading()

    const ts = new Date().getTime()
    const file_location = 'test/' + ts + '/'

    const { data: _dataProject, error: _errorProject } = await supabase.from('Project')
      .insert({ name, description, status: 'draft', catalog_id: null, files: filesToTable(files), file_location })
      .select('id')
      .single()
    
      if (_errorProject) {
      console.log('_errorProject', _errorProject)
      actions.hideLoading(); return
    }
    
    toast.success('Project created')
    
    console.time('upload')
    await _sendFile(files, file_location)
    console.timeEnd('upload')

    // default field for Process (detail, order, feature)
    const _defaultField = (field: any, fieldName: string) => {
      actions.hideLoading(); return field ?? fields.find(f => f.name === fieldName)?.options?.find(o => o.default)?.value
    }

    const { data: _dataProcess, error: _errorProcess } =
      await supabase.from('Process')
        .insert({ project_id: _dataProject.id, status: 'draft', detail: _defaultField(detail, 'detail'), order: _defaultField(order, 'order'), feature: _defaultField(feature, 'feature') })
        .select('id')
        .single()
    
        if (_errorProcess) {
      console.log('_errorProcess', _errorProcess)
      actions.hideLoading(); return
    }
    
    toast.success('Process created')
    console.log('_dataProcess', _dataProcess)
  }

  const _sendFile = async (files: FileList, file_location: string) => {
    // upload file in supabase storage
    // eseguo sequenzialmente l'upload per dare evidenza all'utente del caricamento
    let percentage = 0
    if (!files || files.length === 0) return
    for (let i = 0; i < files.length; i++) {
      const { data: _dataStorage, error: _errorStorage } =
        await supabase.storage.from('viewer3d-dev')
          .upload(file_location + 'images/' + files[i].name, files[i], { upsert: true })
      percentage = (i + 1) / files.length * 100
      if (_errorStorage) {
        console.log('_errorStorage', _errorStorage, percentage)
      }
      toast.info('File upload ' + files[i].name)
      console.log('_dataStorage', _dataStorage, percentage)
    }
  }


  return (
    <>
    <BaseLayout title="New Project">
      {fields.length && <Form fields={fields} onSubmit={onSubmit} />}
      {/* <FormProject onSubmit={onSubmit} /> */}
    </BaseLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createServerSupabaseClient<Database>(context)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false
      }
    }

  return {
    props: {}
  }

}


export default NewProject;