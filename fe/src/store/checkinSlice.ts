import type { StateCreator } from 'zustand'
import type { Checkin } from '@/types'
import type { BoundStore } from './types'

export interface CheckinSlice {
  checkins: Checkin[]
  addCheckin: (checkin: Omit<Checkin, 'id'>) => void
  updateCheckin: (id: number, updates: Partial<Omit<Checkin, 'id'>>) => void
  deleteCheckin: (id: number) => void
}

export const createCheckinSlice: StateCreator<BoundStore, [], [], CheckinSlice> = (set) => ({
  checkins: [],

  addCheckin: (checkin) =>
    set((state) => ({
      checkins: [
        ...state.checkins,
        {
          ...checkin,
          id: Date.now(),
        },
      ],
    })),

  updateCheckin: (id, updates) =>
    set((state) => ({
      checkins: state.checkins.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),

  deleteCheckin: (id) =>
    set((state) => ({
      checkins: state.checkins.filter((c) => c.id !== id),
    })),
})
