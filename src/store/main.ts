import { proxy, useSnapshot } from 'valtio'
interface State {
  showMessageToast: boolean
  messagesToast: string[]
  loading: boolean
}
const state = proxy<State>({
  showMessageToast: false,
  messagesToast: [],
  loading: false,
})

export const useStore = () => useSnapshot(state)

export const actions = {
  // Message Toast
  addMessageToast: (messageToast: string) => {
    // if (state.messagesToast.length === 10) state.messagesToast.shift()
    state.messagesToast.push(messageToast)
  },
  showMessageToast: (duration: number = 3000) => {
    state.showMessageToast = true

    const t = setTimeout(() => (state.showMessageToast = false), duration)
    return () => clearTimeout(t)
  },
  // Loading
  showLoading: () => (state.loading = true),
  hideLoading: () => (state.loading = false),
}
