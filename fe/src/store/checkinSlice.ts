import type { StateCreator } from 'zustand'
import type { CheckIn } from '@/types'
import type { BoundStore } from './types'

export interface CheckInSlice {
  checkIns: CheckIn[]
  setCheckIns: (checkIns: CheckIn[]) => void
  upsertCheckIn: (checkIn: CheckIn) => void
  removeCheckIn: (id: string) => void
  removeCheckInsForHabit: (habitId: string) => void
}

export const createCheckinSlice: StateCreator<BoundStore, [], [], CheckInSlice> = (set) => ({
  checkIns: [],

  setCheckIns: (checkIns) => set({ checkIns }),

  upsertCheckIn: (checkIn) =>
    set((state) => {
      const exists = state.checkIns.some(
        (c) => c.habitId === checkIn.habitId && c.date === checkIn.date
      )
      return {
        checkIns: exists
          ? state.checkIns.map((c) =>
              c.habitId === checkIn.habitId && c.date === checkIn.date ? checkIn : c
            )
          : [...state.checkIns, checkIn],
      }
    }),

  removeCheckIn: (id) =>
    set((state) => ({
      checkIns: state.checkIns.filter((c) => c.id !== id),
    })),

  removeCheckInsForHabit: (habitId) =>
    set((state) => ({
      checkIns: state.checkIns.filter((c) => c.habitId !== habitId),
    })),
})
