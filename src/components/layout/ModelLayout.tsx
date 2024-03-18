import { Footer } from "./Footer"

interface ModelLayoutProp {
    children: React.ReactNode
}

export const ModelLayout: React.FC<ModelLayoutProp> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
        <header className="bg-violet-400 text-white">
            <div className="container">
            <h1 className="text-3xl font-semibold">Viewer 3D</h1>
            </div>
        </header>
        <main>
            {children}
        </main>
        <footer className="bg-violet-400 text-white">
            <Footer/>
        </footer>
        </div>
    )
}