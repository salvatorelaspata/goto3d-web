import { Footer } from './Footer';
import { Header } from './Header';

const BaseLayout: React.FC<{ title: string, children: React.ReactNode, footer?: React.ReactNode }> = ({ title, children, footer }) => {
    return (
        <div className="App">
            <Header />
            <main>
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