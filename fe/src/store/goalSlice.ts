import type { StateCreator } from 'zustand'
import type { Goal, GoalProgress, Checkin } from '@/types'
import { currentStreak, totalCompletions } from '@/features/dashboard/services'
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

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value))
}

const toLocalDateString = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

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
          createdAt: toLocalDateString(new Date()),
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
    const currentValue = habit
      ? goal.targetType === 'streak'
        ? currentStreak(habit, checkins)
        : totalCompletions(habit, checkins)
      : 0

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
