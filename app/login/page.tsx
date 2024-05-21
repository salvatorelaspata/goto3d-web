import Auth from "@/components/Auth";

export default async function Home() {
  return (
    <div className="m-4 flex flex-col items-stretch">
      <div className="w-full p-4 mb-4 dark:bg-gray-600 dark:text-gray-100 rounded-xl">
        <Auth />
      </div>
    </div>
  );
}
