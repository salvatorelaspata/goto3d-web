interface RadioCardInputProps {
    label: string,
    name: string,
    description?: string, 
    value: string, 
    default?: boolean
    selected: string
    setSelected: (value: string) => void
    id?: string
    disabled?: boolean
    icon?: React.ReactNode
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const RadioCard:React.FC<RadioCardInputProps> = ({ id, name, disabled, onChange, icon, label, description, value, selected, setSelected }) => {
    const checked = selected && 'dark:peer-checked:text-violet-500 peer-checked:border-violet-600 peer-checked:text-violet-600';
    return (
        <>
        <input disabled={disabled} type="radio" id={`${id}--${value}`} name={`${name}`} value={value} className="hidden peer" 
                            onChange={(e)=>{onChange(e);setSelected(value)}} checked={selected===value}/>
        <label htmlFor={`${id}--${value}`} className={`${selected === value && checked} shadow-md ${!disabled && 'hover:scale-105'} transition duration-300 ease-in-out justify-between w-full p-2 text-gray-500 bg-white border border-gray-200 rounded-lg ${!disabled && 'cursor-pointer dark:hover:text-gray-300 hover:bg-violet-100'} dark:border-gray-700 hover:text-gray-600 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700`}>
            <div className="block">
                <div className="w-full flex flex-row justify-between">
                    <div className="w-full text-md font-semibold">{label}</div>
                    {icon && <div className="w-5 h-5">{icon}</div>}
                </div>
                <div className="w-full">{description}</div>
            </div>
        </label>
        </>
    )
}