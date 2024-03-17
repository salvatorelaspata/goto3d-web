'use server'

import React, { DOMAttributes, lazy, useEffect } from 'react'

// dynamic(
// const DynamicComponentWithNoSSR = lazy(() => import('node_modules/viewer-3d-lit/dist/viewer-3d-lit'))
// { ssr: false })
interface ViewerProps {
  objUrl: string
  textureUrl: string
  backgroundUrl: string
}
export const Viewer: React.FC<ViewerProps> = ({ objUrl, textureUrl = 'https://babbshwgaemnqpeboequ.supabase.co/storage/v1/object/sign/viewer3d-dev/uv_grid_opengl.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2aWV3ZXIzZC1kZXYvdXZfZ3JpZF9vcGVuZ2wuanBnIiwiaWF0IjoxNjk5OTA1NjI0LCJleHAiOjE3MzE0NDE2MjR9.TRZabvDCqUjo3JIYgyOxmj3gYejSrUcATg6qfHfBw9I&t=2023-11-13T20%3A00%3A24.089Z', backgroundUrl }) => {
  // const [objUrl, setObjUrl] = React.useState<string>(objUrl)

  useEffect(() => {
    import('node_modules/viewer-3d-lit/dist/viewer-3d-lit');
  }, [])

  return (
    <>
      <viewer-3d-lit
        object={objUrl}
        texture={textureUrl}
        background={backgroundUrl} >
      </viewer-3d-lit>
    </>)
}

type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: any }>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['viewer-3d-lit']: CustomElement<any>;
    }
  }
}