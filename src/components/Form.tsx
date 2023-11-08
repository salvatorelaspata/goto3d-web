import { useState } from "react"

export interface FieldProps {
  id: string,
  label: string,
  name: string,
  type: 'text' | 'textarea' | 'select' | 'file',
  options?: { label: string, value: string, default?: boolean }[], // for select
  multiple?: boolean, // for file
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void,
  onFileChange?: (e: React.ChangeEvent<FileEventTarget>) => void
}

interface FormProps {
  fields: FieldProps[],
  onSubmit: (data: any) => void,
  children?: React.ReactNode
}

type FileEventTarget = HTMLInputElement & { files: FileList };

const _composeInput = ({ id, label, name, type, options, multiple, onChange, onFileChange }: FieldProps) => {
  let htmlLabel = <label htmlFor={id} className="mt-5">{label}</label>
  switch (type) {
    case 'select':
      return (<>
        {htmlLabel}
        <select defaultValue={options?.find(o => o.default)?.value} id={id} name={name} onChange={onChange} className="bg-violet-200">
          {options?.map(({ label, value, default: d }) => (
            <option key={value} value={value}>{label} {d && '(default)'}</option>
          ))}
        </select>
      </>
      );
    case 'textarea':
      return (<>{htmlLabel}<textarea id={id} name={name} onChange={onChange} className="bg-violet-200" /></>)
    case 'file':
      return (<>{htmlLabel}<input id={id} name={name} type={type} multiple onChange={onFileChange} className="bg-violet-200" /></>)
    default:
      return (<>{htmlLabel}<input id={id} name={name} type={type} onChange={onChange} className="bg-violet-200" /></>)
  }
}


const Form: React.FC<FormProps> = ({ fields, onSubmit, children }) => {
  const [data, setData] = useState({})

  const handleFileChange = (e: React.ChangeEvent<FileEventTarget>) => {
    const { name, files } = e.target
    setData({ ...data, [name]: files })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col p-10">
      {fields.length && fields.map((f) => {
        f.onChange = handleChange
        f.onFileChange = handleFileChange
        return (
          <div key={f.id} className="flex flex-col">
            {_composeInput(f)}
          </div>
        )
      })}
      {children}
      <div className="flex justify-around mt-10">
        <button type="submit" className="bg-violet-400 w-full mr-2">
          Submit
        </button>
        <button type="reset" className="bg-violet-400 w-full ml-2">
          Reset
        </button>
      </div>
    </form >
  )
}

export default Form