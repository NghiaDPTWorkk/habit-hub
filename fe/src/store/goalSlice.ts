import type { StateCreator } from 'zustand'
import type { Goal, GoalProgress, Checkin } from '@/types'
import type { BoundStore } from './types'

export interface GoalSlice {
  goals: Goal[]
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void
  updateGoal: (id: string, updates: Partial<Omit<Goal, 'id' | 'createdAt'>>) => void
  deleteGoal: (id: string) => void
  getGoalProgress: (goal: Goal, checkins: Checkin[]) => GoalProgress
}

const calculateConsecutiveStreak = (habitId: string, checkins: Checkin[]): number => {
  if (checkins.length === 0) return 0

  const filteredCheckins = checkins
    .filter((c) => String(c.habitId) === String(habitId) && c.status === 'Completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (filteredCheckins.length === 0) return 0

  let streak = 0
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  for (const checkin of filteredCheckins) {
    const checkinDate = new Date(checkin.date)
    checkinDate.setHours(0, 0, 0, 0)

    const diffTime = currentDate.getTime() - checkinDate.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)

    if (diffDays === streak) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

const calculateTotalCompletions = (habitId: string, checkins: Checkin[]): number => {
  return checkins
    .filter((c) => String(c.habitId) === String(habitId) && c.status === 'Completed')
    .reduce((sum, c) => sum + c.completedCount, 0)
}

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value))
}

export const createGoalSlice: StateCreator<BoundStore, [], [], GoalSlice> = (set) => ({
  goals: [],

  addGoal: (goal) =>
    set((state) => ({
      goals: [
        ...state.goals,
        {
          ...goal,
          id: Date.now().toString(),
          createdAt: new Date().toISOString().split('T')[0],
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
    const currentValue =
      goal.targetType === 'streak'
        ? calculateConsecutiveStreak(goal.habitId, checkins)
        : calculateTotalCompletions(goal.habitId, checkins)

    const percentage = clamp((currentValue / goal.targetValue) * 100, 0, 100)
    const isAt80Percent = percentage >= 80 && percentage < 100
    const isCompleted = percentage >= 100

    return {
      goalId: goal.id,
      currentValue,
      percentage,
      isAt80Percent,
      isCompleted,
    }
  },
})
