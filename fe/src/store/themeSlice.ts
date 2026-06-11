import type { StateCreator } from 'zustand'
import type { BoundStore } from './types'

export interface ThemeSlice {
  themeMode: 'light' | 'dark'
  toggleThemeMode: () => void
  setThemeMode: (mode: 'light' | 'dark') => void
}

export const createThemeSlice: StateCreator<BoundStore, [], [], ThemeSlice> = (set) => ({
  themeMode: 'light',

  toggleThemeMode: () =>
    set((state) => ({
      themeMode: state.themeMode === 'light' ? 'dark' : 'light',
    })),

  setThemeMode: (mode) => set({ themeMode: mode }),
})
