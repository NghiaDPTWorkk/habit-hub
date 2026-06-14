import type { StateCreator } from 'zustand'
import type { Checkin } from '@/types'
import type { BoundStore } from './types'

export const makeCheckinKey = (habitId: number, date: string) => `${date}_${habitId}`

export interface CheckinSlice {
  checkins: Record<string, Checkin>
  previousCheckins: Record<string, Checkin> | null
  addCheckin: (checkin: Checkin) => void
  updateCheckin: (
    habitId: number,
    date: string,
    updates: Partial<Omit<Checkin, 'habitId' | 'date'>>
  ) => void
  deleteCheckin: (habitId: number, date: string) => void
  undoLastCheckin: () => void
}

export const createCheckinSlice: StateCreator<BoundStore, [], [], CheckinSlice> = (set) => ({
  checkins: {},
  previousCheckins: null,

  addCheckin: (checkin) =>
    set((state) => ({
      previousCheckins: state.checkins,
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
      return {
        previousCheckins: state.checkins,
        checkins: { ...state.checkins, [key]: { ...existing, ...updates } },
      }
    }),

  deleteCheckin: (habitId, date) =>
    set((state) => {
      const key = makeCheckinKey(habitId, date)
      const existing = state.checkins[key]
      if (!existing) return state
      const next = { ...state.checkins }
      delete next[key]
      return {
        previousCheckins: state.checkins,
        checkins: next,
      }
    }),

  undoLastCheckin: () =>
    set((state) => {
      if (!state.previousCheckins) return state
      return {
        checkins: state.previousCheckins,
        previousCheckins: null,
      }
    }),
})
