
import { privateRoutes, publicRoutes } from '@/utils/constants';
import { useRouter } from 'next/router';
import React from 'react';

export const Breadcrumbs: React.FC = () => {
    const router = useRouter()
    const path = router.asPath
    const routes = publicRoutes.concat(privateRoutes)
    // check current route and compose the breadcrumbs
    const crumbs = path.split('/').filter((crumb) => crumb)
    const breadcrumbs = ()=>crumbs.map((crumb, i) => {
        const url = `/${crumbs.slice(0, i + 1).join('/')}`
        const route = routes.find((r) => r.url === url)
        return route ? (
            <li key={i} className='flex items-center m-0'>
                <a href={route.url} className='text-blue-500'>{route.name}</a>
                {i < crumbs.length - 1 && <span className='mx-2'>{`/`}</span>}
            </li>
        ) : url.includes('new') ? (<li key={'new'}>New</li>) : (
            <li key={i} className='flex items-center m-0'>
                <span>{crumb}</span>
                {i < crumbs.length - 1 && <span className='mx-2'>{`//`}</span>}
            </li>
        )
    })

    return (
        <nav className='flex items-center'>
            <ul className='flex items-center space-x-2'>
                {breadcrumbs()}
            </ul>
        </nav>
    )
}