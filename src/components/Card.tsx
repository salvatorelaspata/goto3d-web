interface Props {
  title: string;
  body: string;
  href: string;
  icon: string;
  className?: string;
}

export const Card: React.FC<Props> = ({ href, title, body, icon, className }) => {
  const [key, ...rest] = title.split(' ')
  return (
    <a
      href={href}
      className={`flex flex-col bg-white w-80 p-3 shadow-lg rounded-md hover:bg-violet-300 hover:shadow-2xl ${className}`}
    >
      <div className="flex justify-between">
        <h2 className="text-2xl"><span className='font-bold'>{key}</span> {rest.join(' ')}</h2>
        <span className="text-2xl font-bold">{icon}</span>
      </div>
      <p className="text-xltext-violet-600  font-bold">
        🔥 {body}
      </p>
    </a>
  )
};