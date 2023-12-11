import { proxy, useSnapshot } from 'valtio'

const state = proxy({ messageToast: '' })

export const useStore = () => useSnapshot(state)

export const actions = {
  setMessageToast: (messageToast: string) =>
    (state.messageToast = messageToast),
  showMessageToast: (messageToast: string, duration: number = 3000) => {
    actions.setMessageToast(messageToast)
    setTimeout(() => actions.setMessageToast(''), duration)
  },
}
