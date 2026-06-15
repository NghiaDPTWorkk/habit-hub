import type { StateCreator } from 'zustand'
import type { BoundStore } from './types'

export interface ThemeSlice {
  themeMode: 'light' | 'dark'
  toggleThemeMode: () => void
  setThemeMode: (mode: 'light' | 'dark') => void
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

export const createThemeSlice: StateCreator<BoundStore, [], [], ThemeSlice> = (set) => ({
  themeMode: getSystemTheme(),

  toggleThemeMode: () =>
    set((state) => ({
      themeMode: state.themeMode === 'light' ? 'dark' : 'light',
    })),

  setThemeMode: (mode) => set({ themeMode: mode }),
})
