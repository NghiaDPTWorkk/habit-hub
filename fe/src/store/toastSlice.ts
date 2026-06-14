import type { StateCreator } from 'zustand'
import type { BoundStore } from './types'

export type ToastSeverity = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: string
  message: string
  severity: ToastSeverity
  isGoalCelebration?: boolean
}

export interface ToastSlice {
  toastQueue: ToastItem[]
  showToast: (message: string, severity: ToastSeverity, isGoalCelebration?: boolean) => void
  dismissToast: () => void
}

export const createToastSlice: StateCreator<BoundStore, [], [], ToastSlice> = (set) => ({
  toastQueue: [],

  showToast: (message, severity, isGoalCelebration) =>
    set((state) => ({
      toastQueue: [
        ...state.toastQueue,
        { id: crypto.randomUUID(), message, severity, isGoalCelebration },
      ],
    })),

  dismissToast: () =>
    set((state) => ({
      toastQueue: state.toastQueue.slice(1),
    })),
})
