import { FieldProps } from "@/components/forms/Form";
type itemHeaderProps = {
  name: string
  url: string
}

export const privateRoutes: itemHeaderProps[] = [
  {
    name: 'Cataloghi (Coming Soon)',
    url: '',
  },
  {
    name: 'Progetti',
    url: '/projects',
  },
  {
    name: 'Profile',
    url: '/profile',
  }
]
export const publicRoutes: itemHeaderProps[] = [
  {
    name: 'Dashboard',
    url: '/',
  },
]


export const formFields: FieldProps[] = [
  {
    id: 'formName', // uuidv4(), 
    label: 'Name',
    name: 'name',
    type: 'text'
  }, {
    id: 'formDescription', // uuidv4(), 
    label: 'Description',
    name: 'description',
    type: 'textarea'
  },
  {
    id: 'formFiles', // uuidv4(),
    label: 'Files',
    name: 'files',
    type: 'file',
    multiple: true
  },
  {
    id: 'formDetail', // uuidv4(),
    label: 'Details',
    name: 'detail',
    type: 'radio',
    description: 'The level of detail of the project',
    icon: '🧐',
    options: [
      { label: 'Preview', value: 'preview', description: 'more fast' },
      { label: 'Reduced', value: 'reduced', description: 'good compromise' },
      { label: 'Medium', value: 'medium', default: true, description: 'good compromise' },
      { label: 'Full', value: 'full', description: 'more accurate' },
      { label: 'Raw', value: 'raw', description: 'original data' }
    ]
  },
  {
    id: 'formOrder', // uuidv4(),
    label: 'Orders',
    name: 'order',
    type: 'radio',
    description: 'The order of the project',
    icon: '👔',
    options: [
      { label: 'Unordered', value: 'unordered', default: true, description: 'no specific order' },
      { label: 'Sequential', value: 'sequential', description: 'ordered by time' },
    ]
  },
  {
    id: 'formFeature', // uuidv4(),
    label: 'Features',
    name: 'feature',
    type: 'radio',
    description: 'The features of the project',
    icon: '💎',
    options: [
      { label: 'Normal', value: 'normal', default: true, description: 'no specific feature' },
      { label: 'High', value: 'high', description: 'more features' }
    ]
  }
]

export const filesToTable = (files: FileList, project_id?: number) => {
  return Array.from(files || []).map((file) => {
    return { file_name: file.name, mime_type: file.type, size: file.size, ...(project_id && { project_id: project_id }) }
  })
}