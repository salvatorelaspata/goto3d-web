import { useStore } from "@/store/main"

const MessageToast: React.FC = () => {
  const { messagesToast } = useStore()
  return (
    <div className="fixed h-96 max-w-96 overflow-y-auto bottom-10 right-5 px-5 py-4 border-r-8 border-2 border-gray-200 rounded-md border-r-blue-500 bg-white drop-shadow-xl">
      <p className="text-sm">
        <span className="mr-2 inline-block px-3 py-1 rounded-full bg-blue-500 text-white font-extrabold">i</span>
        <span className="font-bold">Log</span>
      </p>
      <ul>
        {messagesToast.map((message, index) => (
          <li key={index} className="text-gray-700">{message}</li>
        ))}
      </ul>
    </div>
  )
}

export default MessageToast