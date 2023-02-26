import Form, { FieldProps } from "@/components/Form";
import BaseLayout from "@/components/layout/BaseLayout";
import Link from "next/link";
import { v4 as uuidv4 } from 'uuid';

interface NewCatalogProps {
  fields: FieldProps[]
}

const NewCatalog: React.FC<NewCatalogProps> = ({ fields }) => {
  return (
    <BaseLayout title="New Catalog">
      <Form fields={fields} onSubmit={console.log} />
    </BaseLayout>
  );
};


export const getStaticProps = async () => {
  const fields: FieldProps[] = [{
    id: uuidv4(), label: 'Name',
    name: 'name',
    type: 'text'
  }, {
    id: uuidv4(), label: 'Description',
    name: 'description',
    type: 'textarea'
  },
  {
    id: uuidv4(), label: 'Visibility',
    name: 'visibility',
    type: 'select',
    options: [
      { label: 'Select Visibility', value: '' },
      { label: 'Public', value: 'public' },
      { label: 'Private', value: 'private' }
    ]
  },
  {
    id: uuidv4(),
    label: 'Projects',
    name: 'projects',
    type: 'select',
    options: [
      { label: 'Select Projects', value: '' },
      { label: 'Project 1', value: 'project1' },
      { label: 'Project 2', value: 'project2' }
    ],
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