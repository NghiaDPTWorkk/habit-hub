import { getLocalDateString } from '@/utils'
import type { StateCreator } from 'zustand'
import type { Habit, Note } from '@/types'
import type { BoundStore } from './types'

export interface HabitNote {
  id: string
  habitId: number
  date: string
  content: string
}

export interface HabitSlice {
  habits: Habit[]
  notes: HabitNote[]
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'> & { createdAt?: string }) => void
  updateHabit: (id: number, updates: Partial<Habit>) => void
  deleteHabit: (id: number) => void
  addNote: (habitId: number, date: string, content: string) => void
  updateNote: (noteId: string, content: string) => void
  deleteNote: (noteId: string) => void
}

export const createHabitSlice: StateCreator<BoundStore, [], [], HabitSlice> = (set) => ({
  habits: [],
  notes: [],

  addHabit: (habit) =>
    set((state) => ({
      habits: [
        ...state.habits,
        {
          ...habit,
          id: state.habits.length > 0 ? Math.max(...state.habits.map((h) => h.id)) + 1 : 1,
          createdAt: habit.createdAt ?? getLocalDateString(),
        },
      ],
    })),

  updateHabit: (id, updates) =>
    set((state) => ({
      habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
    })),

  deleteHabit: (id) =>
    set((state) => {
      const exists = state.habits.some((h) => h.id === id)
      if (!exists) return state

      return {
        habits: state.habits.filter((h) => h.id !== id),
        checkins: Object.fromEntries(
          Object.entries(state.checkins).filter(([, c]) => c.habitId !== id)
        ),
        goals: state.goals.filter((g) => g.habitId !== id),
      }
    }),

  addNote: (habitId, date, content) =>
    set((state) => ({
      notes: [
        ...state.notes,
        {
          id: crypto.randomUUID(),
          habitId,
          date,
          content,
          createdAt: new Date().toISOString(),
        },
      ],
    })),

  updateNote: (noteId, content) =>
    set((state) => ({
      notes: state.notes.map((n) => (n.id === noteId ? { ...n, content } : n)) as Note[],
    })),

  deleteNote: (noteId) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== noteId) as Note[],
    })),
})
