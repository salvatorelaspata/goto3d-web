import { useState } from "react"
import { RadioCard } from "./RadioCard";

export interface FieldProps {
  id: string,
  label: string,
  description?: string,
  name: string,
  type: 'text' | 'textarea' | 'select' | 'file' | 'radio',
  icon?: string, // for radio
  options?: { label: string, value: string, description?: string, default?: boolean }[], // for select
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

const _composeInput = ({ id, label, name, type, icon, options, multiple, onChange, onFileChange }: FieldProps) => {
  let htmlLabelFor = <label htmlFor={id} className="mt-5 text-lg">{label}</label>
  let htmlLabel = <span className="mt-5 text-lg">{label}</span>
  switch (type) {
    case 'select':
      return (<>
        {htmlLabelFor}
        <select defaultValue={options?.find(o => o.default)?.value} id={id} name={name} onChange={onChange} className="border border-violet-600 bg-white">
          {options?.map(({ label, value, default: d }) => (
            <option key={value} value={value}>{label} {d && '(default)'}</option>
          ))}
        </select>
      </>
      );
    case 'radio':
      return (<>{htmlLabel}<RadioCard id={id} name={name} options={options} onChange={onChange} icon={icon}/></>)
    case 'textarea':
      return (<>{htmlLabelFor}<textarea id={id} name={name} onChange={onChange} className="border border-violet-600 bg-white rounded-md p-2" /></>)
    case 'file':
      return (<>{htmlLabelFor}<input id={id} name={name} type={type} multiple={multiple} onChange={onFileChange} className="border border-violet-600 bg-white rounded-md p-2" /></>)
    default:
      return (<>{htmlLabelFor}<input id={id} name={name} type={type} onChange={onChange} className="border border-violet-600 bg-white rounded-md p-2" /></>)
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
    <form onSubmit={handleSubmit} className="flex flex-col">
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
        <button type="submit" className="rounded-md hover:scale-110 transition duration-300 ease-in-out shadow-md bg-violet-400 text-white font-bold p-4 w-full mr-2">
          Submit
        </button>
        <button type="reset" className="rounded-md shadow-md bg-violet-200 p-4 w-full ml-2">
          Reset
        </button>
      </div>
    </form>
  )
}

export default Form