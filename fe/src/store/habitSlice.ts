import type { StateCreator } from 'zustand'
import type { Habit } from '@/types'
import type { BoundStore } from './types'

export interface HabitSlice {
  habits: Habit[]
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void
  updateHabit: (id: number, updates: Partial<Habit>) => void
  deleteHabit: (id: number) => void
}

export const createHabitSlice: StateCreator<BoundStore, [], [], HabitSlice> = (set) => ({
  habits: [],

  addHabit: (habit) =>
    set((state) => ({
      habits: [
        ...state.habits,
        {
          ...habit,
          id: Date.now(),
          createdAt: new Date().toISOString().split('T')[0],
        },
      ],
    })),

  updateHabit: (id, updates) =>
    set((state) => ({
      habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
    })),

  deleteHabit: (id) =>
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id),
    })),
})
