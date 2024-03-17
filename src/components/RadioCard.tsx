import { ChangeEvent, useRef, useState } from "react"
import { FieldProps } from "./Form"

interface RadioCardProps {
    id: FieldProps['id']
    name: FieldProps['name']
    icon: FieldProps['icon']
    options: FieldProps['options']
    onChange: any
}

export const RadioCard: React.FC<RadioCardProps> = ({id, name, icon, options, onChange}) => {
    const gridCols = options && options?.length > 2 ? `md:grid-cols-3 lg:grid-cols-5` : `md:grid-cols-2` 
    const [selected, setSelected] = useState<string>("");
    const checked = selected && 'dark:peer-checked:text-violet-500 peer-checked:border-violet-600 peer-checked:text-violet-600';
    const ref = useRef<HTMLInputElement>(null);
    return (
        <>
            {/* <h3 className="mb-5 text-lg font-medium text-gray-900 dark:text-white">How much do you expect to use each month?</h3> */}
            <ul id={id} className={`grid w-full gap-4 ${gridCols} sm:grid-cols-1`}>
                {options && options.map(({ label, description, value, default: d }) => (
                <li key={value} className="flex justify-between shadow-md hover:scale-105 transition duration-300 ease-in-out">
                    <input ref={ref} type="radio" id={`${id}--${value}`} name={`${name}`} value={value} className="hidden peer" 
                            onChange={(e)=>{onChange(e);setSelected(value)}} checked={selected===value}/>
                    <label htmlFor={`${id}--${value}`} className={`${selected === value && checked} justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 hover:text-gray-600 hover:bg-violet-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700`}>
                        <div className="block">
                            <div className="w-full flex flex-row justify-between">
                                <div className="w-full text-md font-semibold">{label}</div>
                                {/* <svg className={`w-5 h-5 ms-3 rtl:rotate-180 peer-checked:visible`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                </svg> */}
                                {icon && <div className="w-5 h-5">{icon}</div>}
                            </div>
                            <div className="w-full">{description}</div>
                        </div>
                    </label>
                </li>
                ))}
            </ul>

        </>
    )
}