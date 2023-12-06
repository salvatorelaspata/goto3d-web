import { useLoader } from '@/hooks/useLoader';
import { Footer } from './Footer';
import { Header } from './Header';
import { Loader } from '../Loader';
import MessageToast from '../MessageToast';

const BaseLayout: React.FC<{ title: string, children: React.ReactNode, footer?: React.ReactNode }> = ({ title, children, footer }) => {
  const { loading } = useLoader()
  return (
    <div className="App">
      <Header />
      <main>
        {loading && <Loader />}
        {<MessageToast />}
        <h1 className='px-4'><span className='text-gradient'>{title}</span></h1>
        {children}
      </main>
      <Footer>
        {footer}
      </Footer>
    </div>
  )
}

export default BaseLayout;