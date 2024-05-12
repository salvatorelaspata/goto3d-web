export const CompleteButton: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => (
  <button
    className="border-green-600 border-2 text-white p-5 rounded-md text-xl font-bold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-violet-100"
    onClick={onClick}
  >
    Done {"✅"}
  </button>
);
