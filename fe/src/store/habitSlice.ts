import type { StateCreator } from 'zustand'
import type { Habit } from '@/types'
import type { BoundStore } from './types'

export interface HabitSlice {
  habits: Habit[]
  setHabits: (habits: Habit[]) => void
  upsertHabit: (habit: Habit) => void
  removeHabit: (id: string) => void
}

export const createHabitSlice: StateCreator<BoundStore, [], [], HabitSlice> = (set) => ({
  habits: [],

  setHabits: (habits) => set({ habits }),

  upsertHabit: (habit) =>
    set((state) => {
      const exists = state.habits.some((h) => h.id === habit.id)
      return {
        habits: exists
          ? state.habits.map((h) => (h.id === habit.id ? habit : h))
          : [...state.habits, habit],
      }
    }),

  removeHabit: (id) =>
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id),
    })),
})
