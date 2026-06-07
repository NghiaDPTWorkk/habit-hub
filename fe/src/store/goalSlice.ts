import type { StateCreator } from 'zustand'
import type { Goal } from '@/types'
import type { BoundStore } from './types'

export interface GoalSlice {
  goals: Goal[]
  setGoals: (goals: Goal[]) => void
  upsertGoal: (goal: Goal) => void
  removeGoal: (id: string) => void
  removeGoalForHabit: (habitId: string) => void
}

export const createGoalSlice: StateCreator<BoundStore, [], [], GoalSlice> = (set) => ({
  goals: [],

  setGoals: (goals) => set({ goals }),

  upsertGoal: (goal) =>
    set((state) => {
      const exists = state.goals.some((g) => g.id === goal.id)
      return {
        goals: exists
          ? state.goals.map((g) => (g.id === goal.id ? goal : g))
          : [...state.goals, goal],
      }
    }),

  removeGoal: (id) =>
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== id),
    })),

  removeGoalForHabit: (habitId) =>
    set((state) => ({
      goals: state.goals.filter((g) => g.habitId !== habitId),
    })),
})
