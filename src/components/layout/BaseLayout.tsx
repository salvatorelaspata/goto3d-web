import { Footer } from './Footer';
import { Header } from './Header';
import { Loader } from '../Loader';
import { useStore } from '@/store/main';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal } from '../Modal';
interface BaseLayoutProps { 
    title: string, 
    children: React.ReactNode, 
    withFooter?: boolean 
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ title, children, withFooter = false }) => {
  const { loading } = useStore()
  return (
    <div className="flex flex-col min-h-screen p-4">
      <Header />
      <main className='bg-gray-100 p-4 rounded-md'>
        {loading && <Loader />}
        <h1>
          <span className='text-3xl font-bold mb-2 text-gradient'>{title}</span>
        </h1>
        {children}
      </main>
      {withFooter && <Footer/>}
      <ToastContainer/>
      <Modal />
    </div>
  )
}

export default BaseLayout;