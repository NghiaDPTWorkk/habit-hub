import type { StateCreator } from 'zustand'
import type { Goal, GoalProgress, Checkin } from '@/types'
import { currentStreak, totalCompletions } from '@/features/dashboard/services'
import { getLocalDateString } from '@/utils'
import type { BoundStore } from './types'

export interface GoalSlice {
  goals: Goal[]
  notifiedGoals: Record<string, boolean>
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void
  updateGoal: (id: string, updates: Partial<Omit<Goal, 'id' | 'createdAt'>>) => void
  deleteGoal: (id: string) => void
  markGoalNotified: (key: string) => void
  getGoalProgress: (goal: Goal, checkins: Checkin[]) => GoalProgress
}

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value))

export const createGoalSlice: StateCreator<BoundStore, [], [], GoalSlice> = (set, get) => ({
  goals: [],
  notifiedGoals: {},

  markGoalNotified: (key) =>
    set((state) => ({
      notifiedGoals: { ...state.notifiedGoals, [key]: true },
    })),

  addGoal: (goal) =>
    set((state) => ({
      goals: [
        ...state.goals,
        {
          ...goal,
          id: Date.now().toString(),
          createdAt: getLocalDateString(),
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

  getGoalProgress: (goal, checkins) => {
    const habit = get().habits.find((h) => h.id === goal.habitId)
    const currentValue = (() => {
      if (!habit) return 0
      return goal.targetType === 'streak'
        ? currentStreak(habit, checkins)
        : totalCompletions(habit, checkins)
    })()

    const percentage = clamp(Math.round((currentValue / goal.targetValue) * 100), 0, 100)

    return {
      goalId: goal.id,
      currentValue,
      percentage,
      isAt80Percent: percentage >= 80 && percentage < 100,
      isCompleted: percentage >= 100,
    }
  },
})
