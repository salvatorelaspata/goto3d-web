import { Footer } from './Footer';
import { Header } from './Header';

const BaseLayout: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => {
    return (
        <>
            <Header />
            <main>
                <h1 className='px-4'><span className='text-gradient'>{title}</span></h1>
                {children}
            </main>
            <Footer />
        </>
    )
}

export default BaseLayout;