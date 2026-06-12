import type { StateCreator } from 'zustand'
import type { BoundStore } from './types'

export type ToastSeverity = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: string
  message: string
  severity: ToastSeverity
}

export interface ToastSlice {
  toastQueue: ToastItem[]
  showToast: (message: string, severity: ToastSeverity) => void
  dismissToast: () => void
}

export const createToastSlice: StateCreator<BoundStore, [], [], ToastSlice> = (set) => ({
  toastQueue: [],

  showToast: (message, severity) =>
    set((state) => ({
      toastQueue: [...state.toastQueue, { id: crypto.randomUUID(), message, severity }],
    })),

  dismissToast: () =>
    set((state) => ({
      toastQueue: state.toastQueue.slice(1),
    })),
})
