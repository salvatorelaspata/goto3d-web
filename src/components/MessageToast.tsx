import { useStore } from "@/store/main"

const MessageToast: React.FC = () => {
  const { messageToast } = useStore()
  return (
    <div className="fixed bottom-10 right-5 w-96 px-5 py-4 border-r-8 border-2 border-gray-200 rounded-md border-r-blue-500 bg-white drop-shadow-xl">
      <p className="text-sm">
        <span className="mr-2 inline-block px-3 py-1 rounded-full bg-blue-500 text-white font-extrabold">i</span>
        {messageToast}
      </p>
    </div>
  )
}

export default MessageToast