import type { StateCreator } from 'zustand'
import type { BoundStore } from './types'

export interface MetaSlice {
  seededAt: string | null
  setSeededAt: (ts: string) => void
}

export const createMetaSlice: StateCreator<BoundStore, [], [], MetaSlice> = (set) => ({
  seededAt: null,

  setSeededAt: (ts) => set({ seededAt: ts }),
})
