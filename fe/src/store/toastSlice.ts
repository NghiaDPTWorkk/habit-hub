import type { StateCreator } from 'zustand'
import type { BoundStore } from './types'

export type ToastSeverity = 'success' | 'error' | 'warning' | 'info'

export interface ToastState {
  open: boolean
  message: string
  severity: ToastSeverity
}

export interface ToastSlice {
  toast: ToastState
  showToast: (message: string, severity?: ToastSeverity) => void
  hideToast: () => void
}

const TOAST_INITIAL_STATE: ToastState = {
  open: false,
  message: '',
  severity: 'info',
}

export const createToastSlice: StateCreator<BoundStore, [], [], ToastSlice> = (set) => ({
  toast: TOAST_INITIAL_STATE,

  showToast: (message, severity = 'info') =>
    set(() => ({
      toast: { open: true, message, severity },
    })),

  hideToast: () =>
    set((state) => ({
      toast: { ...state.toast, open: false },
    })),
})
