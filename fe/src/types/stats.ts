import type { Category, Habit } from './habit'
import type { Goal } from './goal'

export interface HabitSummary {
  habit: Habit
  currentStreak: number
  longestStreak: number
  totalCompletions: number
  weeklyCompletionRate: number // 0..1
  todayCompleted: boolean
  isAtRisk: boolean
  activeGoal: Goal | null
}

export interface DashboardDto {
  summary: {
    activeHabits: number
    percentCompletedToday: number // 0..1
    atRiskHabits: number
    atRiskHabitIds: string[]
    checkInsThisWeek: number
    achievedGoals: number
  }
  habitsByCategory: { category: Category; habits: HabitSummary[] }[]
}
