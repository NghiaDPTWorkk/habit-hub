import type { StateCreator } from 'zustand'
import type { Goal } from '@/types'
import type { BoundStore } from './types'


export interface GoalSlice {
  goals: Goal[]
  addGoal: (goal: Omit<Goal, 'id'>) => void
  updateGoal: (id: number, updates: Partial<Omit<Goal, 'id'>>) => void
  deleteGoal: (id: number) => void
}

export const createGoalSlice: StateCreator<BoundStore, [], [], GoalSlice> = (set) => ({
  goals: [],

  addGoal: (goal) =>
    set((state) => ({
      goals: [
        ...state.goals,
        {
          ...goal,
          id: Date.now(),
        },
      ],
    })),

  updateGoal: (id, updates) =>
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === id ? { ...g, ...updates } : g
      ),
    })),

  deleteGoal: (id) =>
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== id),
    })),
})