import Form, { FieldProps } from "@/components/Form";
import BaseLayout from "@/components/layout/BaseLayout";
import { useLoader } from '@/hooks/useLoader';
import { Database } from "@/types/supabase";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
// import axios from "axios";
import { GetServerSideProps } from "next";
import { v4 as uuidv4 } from 'uuid';

interface NewProjectProps {
  fields: FieldProps[]
}

const _filesToTable = (files: FileList, project_id?: number) => {
  return Array.from(files || []).map((file) => {
    return { file_name: file.name, mime_type: file.type, size: file.size, ...(project_id && { project_id: project_id }) }
  })
}


const NewProject: React.FC<NewProjectProps> = ({ fields }) => {
  const supabase = useSupabaseClient<Database>()

  const { load, hide } = useLoader()

  const onSubmit = async ({ name, description, files, detail, order, feature }: any) => {
    load()
    const ts = new Date().getTime()
    const file_location = 'test/' + ts + '/'

    const { data: _dataProject, error: _errorProject } = await supabase.from('Project')
      .insert({ name, description, status: 'draft', catalog_id: null, files: _filesToTable(files), file_location })
      .select('id')
      .single()
    if (_errorProject) {
      console.log('_errorProject', _errorProject)
      hide(); return
    }
    console.log('_dataProject', _dataProject)

    console.time('upload')
    await _sendFile(files, file_location)
    console.timeEnd('upload')

    // default field for Process (detail, order, feature)
    const _defaultField = (field: any, fieldName: string) => {
      hide(); return field ?? fields.find(f => f.name === fieldName)?.options?.find(o => o.default)?.value
    }

    const { data: _dataProcess, error: _errorProcess } =
      await supabase.from('Process')
        .insert({ project_id: _dataProject.id, status: 'draft', detail: _defaultField(detail, 'detail'), order: _defaultField(order, 'order'), feature: _defaultField(feature, 'feature') })
        .select('id')
        .single()
    if (_errorProcess) {
      console.log('_errorProcess', _errorProcess)
      hide(); return
    }
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
      console.log('_dataStorage', _dataStorage, percentage)
    }
  }


  return (
    <BaseLayout title="New Project">
      {fields.length && <Form fields={fields} onSubmit={onSubmit} />}
    </BaseLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createServerSupabaseClient<Database>(context)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session)
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false
      }
    }
  return {
    props: {
      fields: fields
    }
  }

}

const fields: FieldProps[] = [
  {
    id: uuidv4(), label: 'Name',
    name: 'name',
    type: 'text'
  }, {
    id: uuidv4(), label: 'Description',
    name: 'description',
    type: 'textarea'
  },
  {
    id: uuidv4(),
    label: 'Files',
    name: 'files',
    type: 'file',
    multiple: true
  },
  {
    id: uuidv4(),
    label: 'Details',
    name: 'detail',
    type: 'select',
    options: [
      { label: 'Preview', value: 'preview' },
      { label: 'Reduced', value: 'reduced' },
      { label: 'Medium', value: 'medium', default: true },
      { label: 'Full', value: 'full' },
      { label: 'Raw', value: 'raw' },
    ]
  },
  {
    id: uuidv4(),
    label: 'Orders',
    name: 'order',
    type: 'select',
    options: [
      { label: 'Unordered', value: 'unordered', default: true },
      { label: 'Sequential', value: 'sequential' }
    ]
  },
  {
    id: uuidv4(),
    label: 'Features',
    name: 'feature',
    type: 'select',
    options: [
      { label: 'Normal', value: 'normal', default: true },
      { label: 'High', value: 'high' }
    ]
  }
]

export default NewProject;