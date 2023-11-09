import Form, { FieldProps } from "@/components/Form";
import BaseLayout from "@/components/layout/BaseLayout";
import { Database } from "@/types/supabase";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { v4 as uuidv4 } from 'uuid';

interface NewCatalogProps {
  fields: FieldProps[]
}

const NewCatalog: React.FC<NewCatalogProps> = ({ fields }) => {
  const supabase = useSupabaseClient<Database>()
  const onSubmit = async ({ title, description, public: _public, projects }: any) => {
    // save project
    const { data: _dataCatalog, error: _errorCatalog } = await supabase.from('Catalog')
      .insert({ title, description, public: _public === 'public' })
      .select('id')
      .single()
    if (_errorCatalog) {
      console.log(_errorCatalog)
      return
    }
    const { data: _dataCatalogUpdate, error: _errorCatalogUpdate } = await supabase.from('Project')
      .update({ catalog_id: _dataCatalog.id })
      .eq('id', projects);
    if (_errorCatalogUpdate) {
      console.log(_errorCatalogUpdate)
      return
    }
  }
  return (
    <BaseLayout title="New Catalog">
      <Form fields={fields} onSubmit={onSubmit} />
    </BaseLayout>
  );
};


export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createServerSupabaseClient(context)
  const { data: projects, error, count } = await supabase
    .from('Project')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  const mcProject = projects?.map((project) => {
    return {
      label: project.name,
      value: project.id
    }
  }) || []
  mcProject.unshift({ label: 'Select Projects', value: '' })

  const fields: FieldProps[] = [
    {
      id: uuidv4(), label: 'Title',
      name: 'title',
      type: 'text'
    }, {
      id: uuidv4(), label: 'Description',
      name: 'description',
      type: 'textarea'
    },
    {
      id: uuidv4(), label: 'Public',
      name: 'public',
      type: 'select',
      options: [
        { label: 'Select Public', value: '' },
        { label: 'Public', value: 'public' },
        { label: 'Private', value: 'private' }
      ]
    },
    {
      id: uuidv4(),
      label: 'Projects',
      name: 'projects',
      type: 'select',
      options: mcProject,
      multiple: true
    }
  ]
  return {
    props: {
      fields
    }
  }
}
export default NewCatalog;