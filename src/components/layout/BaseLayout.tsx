import { Footer } from "./Footer";
import { Header } from "./Header";
import { Loader } from "../Loader";
import { useStore } from "@/store/main";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "../ui/Modal";
interface BaseLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  withFooter?: boolean;
  fullScreen?: boolean;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  title,
  subtitle,
  children,
  withFooter = false,
  fullScreen = true,
}) => {
  const { loading } = useStore();
  return (
    <div className={`flex flex-col ${fullScreen && "min-h-screen"}`}>
      <Header />
      <main className="bg-gray-100 m-4 p-4 rounded-md">
        {loading && <Loader />}
        <div className="flex">
          <h1 className="text-3xl font-bold mb-4 text-gradient">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-800 mx-2">({subtitle})</p>
          )}
        </div>
        {children}
      </main>
      {withFooter && <Footer />}
      <ToastContainer />
      <Modal />
    </div>
  );
};

export default BaseLayout;
