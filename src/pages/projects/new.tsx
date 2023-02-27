import Form, { FieldProps } from "@/components/Form";
import BaseLayout from "@/components/layout/BaseLayout";
import { Database } from "@/types/supabase";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSideProps } from "next";
import { v4 as uuidv4 } from 'uuid';

interface NewProjectProps {
  fields: FieldProps[],
  user: string
}
const NewProject: React.FC<NewProjectProps> = ({ fields, user }) => {
  const supabase = useSupabaseClient<Database>()
  const onSubmit = async ({ name, description, files }: any) => {
    // save project
    const { data: _dataProject, error: _errorProject } = await supabase.from('Project')
      .insert({ name, description, status: 'draft', catalogs_id: null })
      .select('id')
      .single()
    if (_errorProject) {
      console.log('_errorProject', _errorProject)
      return
    }
    console.log('_dataProject', _dataProject)
    const { data: _dataFiles, error: _errorFiles } = await supabase.from('File').insert(_filesToTable(files, _dataProject.id)).select('id')
    if (_errorFiles) {
      console.log('_errorFiles', _errorFiles)
      return
    }
    console.log('_dataFiles', _dataFiles)
  }
  const _filesToTable = (files: FileList, project_id: number) => {
    return Array.from(files || []).map((file) => {
      return { file_name: file.name, mime_type: file.type, size: file.size, project_id: project_id }
    })
  }
  // const _sendFile = async (files: FileList) => {
  //   const formData = new FormData()
  //   if (files) {
  //     Array.from(files).forEach((file, i) => {
  //       formData.append(`files`, file, file.name)
  //     })
  //   }
  //   // send files to server
  //   try {
  //     const data = await axios.post(`http://localhost:3002/upload-files`, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         "u": user || ''
  //       }
  //     })
  //     console.log('data', data)
  //   } catch (error) {
  //     console.log('error', error)
  //   }
  // }


  return (
    <BaseLayout title="New Project">
      <Form fields={fields} onSubmit={onSubmit} />
    </BaseLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createServerSupabaseClient<Database>(context)
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    return {
      props: {
        fields: [],
      }
    }
  } else {
    return {
      props: {
        fields: fields,
        user: data.user.id
      }
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
  }
]

export default NewProject;