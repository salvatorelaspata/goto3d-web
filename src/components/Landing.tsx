import { Card } from "./Card"
import styles from "../styles/Landing.module.css"
import BaseLayout from './layout/BaseLayout'

interface Props { }

export const Landing: React.FC<Props> = () => {
    return (
        <>
            <p className={styles.instructions}>
                <span><strong className="text-3xl">Config.Reality</strong> ti permette di creare il tuo modello 3d partendo da delle foto</span>
                <br />
                <span className="text-xl"><strong>crea</strong></span> Il tuo progetto.<br />
                <strong>Scegli le tue foto </strong> per procedere alla creazione del tuo modello <code>3D</code>. <br />
                <strong>Genera</strong> il tuo modello <strong>3D</strong> e <strong>scaricalo</strong> in formato <code>.obj</code>. <br />
                <strong>Pubblica</strong> il tuo catalogo <code>privato</code> o <code>pubblico</code> per condividerlo con chi hai voglia.
            </p>
            <ul role="list" className={styles['link-card-grid']}>
                <Card
                    href="/projects/create"
                    title="Crea il Progetto"
                    body="🫥"
                />
                <Card
                    href="https://astro.build/integrations/"
                    title="Genera il Modello"
                    body="♺"
                />
                <Card
                    href="https://astro.build/themes/"
                    title="Crea il catalogo"
                    body="📦"
                />
                <Card
                    href="https://astro.build/chat/"
                    title="Condividi il catalogo"
                    body="❤️"
                />
            </ul>
            <div className="p-6 py-12 dark:bg-violet-400 dark:text-gray-900">
                <div className="container mx-auto">
                    <div className="flex flex-col lg:flex-row items-center justify-between">
                        <h2 className="text-center text-6xl tracking-tighter font-bold">Suvvia¿ cosa aspetti ?
                            <br className="sm:hidden" /><span className="underline text-white text-4xl">Affrettati</span>
                        </h2>
                        <a href="#" rel="noreferrer noopener" className="px-5 mt-4 lg:mt-0 py-3 rounded-md border block dark:bg-gray-50 dark:text-gray-900 dark:border-gray-400">Configura</a>
                    </div>
                </div>
            </div>
        </>
    )
}
