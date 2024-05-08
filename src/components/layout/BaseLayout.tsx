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
    <div className={`flex flex-col ${fullScreen && "h-full"}`}>
      <Header title={title} subtitle={subtitle} />
      <main className="p-4 rounded-md h-full">
        {loading && <Loader />}
        {children}
      </main>
      {withFooter && <Footer />}
      <ToastContainer />
      <Modal />
    </div>
  );
};

export default BaseLayout;
