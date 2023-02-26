import Form, { FieldProps } from "@/components/Form";
import BaseLayout from "@/components/layout/BaseLayout";
import { Database } from "@/types/supabase";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import axios from "axios";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { v4 as uuidv4 } from 'uuid';

interface NewProjectProps {
  fields: FieldProps[],
  user: string
}

const NewProject: React.FC<NewProjectProps> = ({ fields, user }) => {
  const supabase = useSupabaseClient<Database>()
  const onSubmit = ({ name, description }: any) => {
    console.log({ name, description, user })
    // save project
    supabase.from('Project').insert({ name, description, status: 'draft', user_id: user, catalogs_id: null })
      .then(({ data, error }) => {
        console.log({ data, error })
      })
    // send file to processor

  }

  const _sendFile = async (files: FileList) => {
    const formData = new FormData()
    if (files) {
      Array.from(files).forEach((file, i) => {
        formData.append(`files`, file, file.name)
      })
    }
    // send files to server
    try {
      const data = await axios.post(`http://localhost:3002/upload-files`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "u": user || ''
        }
      })
      console.log('data', data)
    } catch (error) {
      console.log('error', error)
    }
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

// export const getStaticProps = async () => {
const fields: FieldProps[] = [{
  id: uuidv4(), label: 'Name',
  name: 'name',
  type: 'text'
}, {
  id: uuidv4(), label: 'Description',
  name: 'description',
  type: 'textarea'
},
// {
//   id: uuidv4(), label: 'Visibility',
//   name: 'visibility',
//   type: 'select',
//   options: [
//     { label: 'Public', value: 'public' },
//     { label: 'Private', value: 'private' }
//   ]
// },
{
  id: uuidv4(),
  label: 'Files',
  name: 'files',
  type: 'file',
  multiple: true
}
]
// return {
//   props: {
//     fields
//   }
// }
// }

export default NewProject;