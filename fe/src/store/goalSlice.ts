import type { StateCreator } from 'zustand'
import type { Goal, GoalProgress } from '@/types'
import type { BoundStore } from './types'

export interface GoalSlice {
  goals: Goal[]
  reachedMilestones: Record<string, boolean>
  addGoal: (goal: Omit<Goal, 'id'>) => void
  updateGoal: (id: number, updates: Partial<Omit<Goal, 'id'>>) => void
  deleteGoal: (id: number) => void
  getGoalProgress: (goal: Goal, currentValue: number) => GoalProgress
  markMilestoneReached: (key: string) => void
}

export const createGoalSlice: StateCreator<BoundStore, [], [], GoalSlice> = (set) => ({
  goals: [],
  reachedMilestones: {},

  getGoalProgress: (goal, currentValue) => {
    if (goal.targetValue <= 0) {
      return { percentage: 0, isEightyPercentReached: false, isCompleted: false }
    }
    const percentage = Math.min(100, Math.round((currentValue / goal.targetValue) * 100))
    return {
      percentage,
      isEightyPercentReached: percentage >= 80,
      isCompleted: percentage >= 100,
    }
  },

  markMilestoneReached: (key) =>
    set((state) => ({
      reachedMilestones: { ...state.reachedMilestones, [key]: true },
    })),

  addGoal: (goal) =>
    set((state) => ({
      goals: [
        ...state.goals,
        {
          ...goal,
          id: state.goals.length > 0 ? Math.max(...state.goals.map((g) => g.id)) + 1 : 1,
        },
      ],
    })),

  updateGoal: (id, updates) =>
    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    })),

  deleteGoal: (id) =>
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== id),
    })),
})
