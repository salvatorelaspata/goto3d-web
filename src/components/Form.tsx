import { useState } from "react"

export interface FieldProps {
  id: string,
  label: string,
  name: string,
  type: 'text' | 'textarea' | 'select' | 'file',
  options?: { label: string, value: string }[], // for select
  multiple?: boolean, // for file
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void,
}

// create form component 
interface FormProps {
  fields: FieldProps[],
  onSubmit: (data: any) => void,
  children?: React.ReactNode
}
type FileEventTarget = HTMLInputElement & { files: FileList };
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
  const handleReset = () => {
    setData({})
  }

  return (
    <form onSubmit={handleSubmit} onReset={handleReset} className="flex flex-col p-10">
      {fields.map(({ id, label, name, type, options, multiple }) => {
        return (
          <div key={id} className="flex flex-col">
            <label htmlFor={id} className="mt-5">{label}</label>
            {type === 'select' ?
              <select id={id} name={name} onChange={handleChange} className="bg-violet-200">
                {options?.map(({ label, value }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              : type === 'textarea' ?
                <textarea id={id} name={name} onChange={handleChange} className="bg-violet-200" />
                :
                <input id={id} name={name} type={type} multiple onChange={type === 'file' ? handleFileChange : handleChange} className="bg-violet-200" />
            }
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
    </form>
  )
}

export default Form