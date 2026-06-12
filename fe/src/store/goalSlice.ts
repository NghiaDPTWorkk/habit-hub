import type { StateCreator } from 'zustand'
import type { Goal, GoalProgress, Checkin } from '@/types'
import { currentStreak } from '@/features/dashboard/services'
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

const calculateConsecutiveStreak = (habitId: number, checkins: Checkin[]): number => {
  if (checkins.length === 0) return 0

  const filteredCheckins = checkins
    .filter((c) => c.habitId === habitId && c.status === 'Completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (filteredCheckins.length === 0) return 0

  let streak = 0
  let expectedDate = new Date()
  expectedDate.setHours(0, 0, 0, 0)

  for (const checkin of filteredCheckins) {
    const checkinDate = new Date(checkin.date)
    checkinDate.setHours(0, 0, 0, 0)

    const diffDays = (expectedDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24)

    if (streak === 0 && diffDays <= 1) {
      // Chấp nhận hôm nay hoặc hôm qua là ngày bắt đầu
      streak++
      expectedDate = new Date(checkinDate)
      expectedDate.setDate(expectedDate.getDate() - 1)
    } else if (streak > 0 && diffDays === 0) {
      streak++
      expectedDate.setDate(expectedDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

const calculateTotalCompletions = (habitId: number, checkins: Checkin[]): number => {
  return checkins
    .filter((c) => c.habitId === habitId && c.status === 'Completed')
    .reduce((sum, c) => sum + c.completedCount, 0)
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
    const habits = get().habits
    const habit = habits.find((h) => h.id === goal.habitId)
    const currentValue =
      goal.targetType === 'streak'
        ? habit
          ? currentStreak(habit, checkins)
          : calculateConsecutiveStreak(goal.habitId, checkins)
        : calculateTotalCompletions(goal.habitId, checkins)

    const percentage = clamp(Math.round((currentValue / goal.targetValue) * 100), 0, 100)
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
