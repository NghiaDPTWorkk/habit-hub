import type { StateCreator } from 'zustand'
import type { Checkin } from '@/types'
import type { BoundStore } from './types'

export const makeCheckinKey = (habitId: number, date: string) => `${date}_${habitId}`

export interface CheckinSlice {
  checkins: Record<string, Checkin>
  addCheckin: (checkin: Checkin) => void
  updateCheckin: (
    habitId: number,
    date: string,
    updates: Partial<Omit<Checkin, 'habitId' | 'date'>>
  ) => void
  deleteCheckin: (habitId: number, date: string) => void
}

export const createCheckinSlice: StateCreator<BoundStore, [], [], CheckinSlice> = (set) => ({
  checkins: {},

  addCheckin: (checkin) =>
    set((state) => ({
      checkins: {
        ...state.checkins,
        [makeCheckinKey(checkin.habitId, checkin.date)]: checkin,
      },
    })),

  updateCheckin: (habitId, date, updates) =>
    set((state) => {
      const key = makeCheckinKey(habitId, date)
      const existing = state.checkins[key]
      if (!existing) return state
      return { checkins: { ...state.checkins, [key]: { ...existing, ...updates } } }
    }),

  deleteCheckin: (habitId, date) =>
    set((state) => {
      const key = makeCheckinKey(habitId, date)
      const next = { ...state.checkins }
      delete next[key]
      return { checkins: next }
    }),
})
