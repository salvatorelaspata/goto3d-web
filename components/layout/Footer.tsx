import type React from 'react'

export const Footer: React.FC = ()=>{
    return (
        <footer className='bg-violet-500 text-white text-center p-1 m-0'>
            <p><span className='font-bold'>{`<POC/>`}</span> Powered with ❤️ by <a href='https://salvatorelaspata.net' className='underline'>Salvatore La Spata</a></p>
        </footer>
    )
}