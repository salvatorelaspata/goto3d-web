import { useCallback, useState } from 'react'

export const useLoader = () => {
  const [loading, setLoading] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
  }, [])

  const hide = useCallback(() => {
    setLoading(false)
  }, [])

  return { loading, load, hide }
}