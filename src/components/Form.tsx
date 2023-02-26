import { useState } from "react"

// create form component 
interface FormProps {
  fields: string[]
  onSubmit: (data: any) => void
}
const Form: React.FC<FormProps> = ({ fields, onSubmit }) => {
  const [data, setData] = useState({})
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(data)
  }
  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field, i) => (
        <div key={i}>
          <label htmlFor={field}>{field}</label>
          <input type="text" name={field} onChange={handleChange} />
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  )
}

export default Form