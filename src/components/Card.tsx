interface Props {
  title: string;
  body: string;
  href: string;
}

export const Card: React.FC<Props> = ({ href, title, body }) => (
  <a href={href} className="flex flex-col bg-white w-80 ml-4 mr-4 p-3 
                            shadow-lg rounded-md
										        hover:bg-violet-300 hover:shadow-2xl">
    <div className="flex justify-between">
      <h2 className="text-2xl font-bold">{title}</h2>
      <span className="text-2xl font-bold">👉</span>
    </div>
    <p className="text-xl mt-4 text-violet-600  font-bold">
      🔥 {body}
    </p>
  </a>
);