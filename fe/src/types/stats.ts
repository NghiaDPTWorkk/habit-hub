import type { Category } from './habit'

export interface HabitSummary {
  habitId: number
  habitName: string
  category: Category
  currentStreak: number
  longestStreak: number
  totalCompletions: number
  weeklyCompletionRate: number // 0..1
  isAtRisk: boolean
}

export interface DashboardSummary {
  activeHabits: number
  percentCompletedToday: number // 0..1
  atRiskHabits: number
  atRiskHabitIds: number[]
  checkInsThisWeek: number
  achievedGoals: number
}

export interface DashboardDto {
  summary: DashboardSummary
  habitsByCategory: { category: Category; habits: HabitSummary[] }[]
}

export interface WeeklyCategoryRate {
  weekLabel: string
  [category: string]: string | number
}
