import Form, { FieldProps } from "@/components/Form";
import BaseLayout from "@/components/layout/BaseLayout";
import { Database } from "@/types/supabase";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
// import axios from "axios";
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

    const ts = new Date().getTime()

    const file_location = 'test/' + ts + '/'

    debugger

    const { data: _dataProject, error: _errorProject } = await supabase.from('Project')
      .insert({ name, description, status: 'draft', catalog_id: null, files: _filesToTable(files), file_location })
      .select('id')
      .single()
    if (_errorProject) {
      console.log('_errorProject', _errorProject)
      return
    }
    console.log('_dataProject', _dataProject)
    // DEPRECATED
    // const { data: _dataFiles, error: _errorFiles } = await supabase.from('File').insert(_filesToTable(files, _dataProject.id)).select('id')
    // if (_errorFiles) {
    //   console.log('_errorFiles', _errorFiles)
    //   return
    // }
    // console.log('_dataFiles', _dataFiles)
    console.time('upload')
    await _sendFile(files)
    console.timeEnd('upload')
    const { data: _dataProcess, error: _errorProcess } =
      await supabase.from('Process')
        .insert({ project_id: _dataProject.id, status: 'draft' })
        .select('id')
  }
  const _filesToTable = (files: FileList, project_id?: number) => {
    return Array.from(files || []).map((file) => {
      return { file_name: file.name, mime_type: file.type, size: file.size, ...(project_id && { project_id: project_id }) }
    })
  }
  const _sendFile = async (files: FileList) => {
    // upload file in supabase storage

    // eseguo sequenzialmente l'upload per dare evidenza all'utente del caricamento
    let percentage = 0
    for (let i = 0; i < files.length; i++) {
      const { data: _dataStorage, error: _errorStorage } =
        await supabase.storage.from('viewer3d-dev')
          .upload('test/' + files[i].name, files[i], { upsert: true })
      percentage = (i + 1) / files.length * 100
      if (_errorStorage) {
        console.log('_errorStorage', _errorStorage, percentage)
      }
      console.log('_dataStorage', _dataStorage, percentage)
    }

    // parallelamente (non funziona.. chissà perchè..)
    // const pAll = []
    // for (let i = 0; i < files.length; i++) {
    //   pAll.push(supabase.storage.from('viewer3d-dev').upload('test/' + files[i].name, files[i]))
    // }
    // try {
    //   const res = await Promise.all(pAll)
    //   console.log('res', res)
    // } catch (error) {
    //   console.log(error)
    // }


    // const formData = new FormData()
    // if (files) {
    //   Array.from(files).forEach((file, i) => {
    //     formData.append(`files`, file, file.name)
    //   })
    // }
    // // send files to server
    // try {
    //   console.log(user)
    //   const data = await axios.post(`${process.env.NEXT_PUBLIC_NGROK}upload-files`, formData, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //       "u": user || '',
    //       // "ngrok-skip-browser-warning": "Yes"
    //     }
    //   })
    //   console.log('data', data)
    // } catch (error) {
    //   console.log('error', error)
    // }
  }


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