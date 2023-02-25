import { Footer } from './Footer';
import { Header } from './Header';

const BaseLayout: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => {
    return (
        <div className="App">
            <Header />
            <main>
                <h1 className='px-4'><span className='text-gradient'>{title}</span></h1>
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default BaseLayout;