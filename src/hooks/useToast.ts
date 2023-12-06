import { useState } from 'react'

interface useToastInput {
  duration?: number
}

type useToastReturn = {
  message: string
  show: (message: string) => void
}

type useToastProps = (...useToastInput) => useToastReturn

export const useToast: useToastProps = (duration = 3000) => {

  const [message, setMessage] = useState('')

  const show = (message: string) => {
    setMessage(message)
    setTimeout(() => {
      setMessage('')
    }, duration)
  }

  return { message, show }
}