import * as React from 'react'
import * as ReactDOM from 'react-dom'

const defaultOptions = {
  timeout: 3000,
  idToastContainer: 'minimal-react-toast',
  styleToastContainer: undefined,
}

interface IStyleToastContainer {
  [key: string]: any
}
interface IUseToast {
  timeout?: number
  idToastContainer?: string
  styleToastContainer?: IStyleToastContainer
}

function useToast(options: IUseToast = defaultOptions) {
  const {
    timeout = defaultOptions.timeout,
    idToastContainer = defaultOptions.idToastContainer,
    styleToastContainer = defaultOptions.styleToastContainer,
  } = options
  const [show, setShow] = React.useState(false)
  const [mountNode, setMountNode] = React.useState<null | HTMLElement>(null)

  const timeoutIdRef = React.useRef<any>(null)

  const triggerToast = React.useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current)
      timeoutIdRef.current = null
      setShow(false)
    }

    const timeoutId = setTimeout(() => {
      setShow(false)
      if (mountNode) {
        setMountNode(null)
        timeoutIdRef.current = null
        mountNode.remove()
      }
    }, timeout)

    setShow(true)
    timeoutIdRef.current = timeoutId
  }, [timeoutIdRef, timeout, mountNode])

  React.useEffect(() => {
    if (show) {
      let minimalToastContainerDiv = document.getElementById(idToastContainer)

      if (!minimalToastContainerDiv) {
        minimalToastContainerDiv = document.createElement('div')
        minimalToastContainerDiv.id = idToastContainer

        if (
          styleToastContainer &&
          Object.prototype.toString.call(styleToastContainer) ===
            '[object Object]' &&
          Object.keys(styleToastContainer).length > 0
        ) {
          Object.keys(styleToastContainer).forEach(property => {
            // @ts-ignore
            minimalToastContainerDiv.style[property] =
              // @ts-ignore
              styleToastContainer[property]
          })
        }
      }

      // console.log(
      //   'useToast -> minimalToastContainerDiv',
      //   minimalToastContainerDiv
      // );

      const div = document.createElement('div')
      const divId = new Date().getTime()
      div.id = `${divId}`
      div.setAttribute('data-minimal-toast', `${divId}`)

      if (minimalToastContainerDiv) {
        minimalToastContainerDiv.appendChild(div)
      }

      document.body.appendChild(minimalToastContainerDiv)
      setMountNode(div)
    } else {
      if (mountNode) {
        setMountNode(null)
        timeoutIdRef.current = null
        mountNode.remove()
      }
    }
  }, [show])

  function toastRender(): Function {
    const elem = mountNode
    return (Component: React.ReactElement) => {
      if (mountNode && elem && Component) {
        return ReactDOM.createPortal(Component, elem)
      }
      return null
    }
  }

  return [triggerToast, toastRender]
}

export { useToast }
