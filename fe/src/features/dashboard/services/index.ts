import type { Habit, Checkin, Goal, Category } from '@/types'
import type { HabitSummary, DashboardDto } from '@/types'
import { isScheduledForDate } from '@/features/habits/services/ScheduleService'
import type { HeatmapDay } from '@/components/ui/CalendarHeatmap'
import type { MiniChartItem } from '@/components/ui/MiniChart'
import { toLocalDateString } from '@/utils'

const CATEGORIES: Category[] = ['Health', 'Study', 'Work', 'Mindfulness', 'Other']
const MAX_STREAK_DAYS = 365

// Returns YYYY-MM-DD in the browser's local timezone.
function localDateStr(d: Date): string {
  return d.toLocaleDateString('en-CA') // en-CA locale always formats as YYYY-MM-DD
}

export function todayStr(): string {
  return localDateStr(new Date())
}

export function subDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T12:00:00') // local noon avoids DST edge cases
  d.setDate(d.getDate() - n)
  return localDateStr(d)
}

export function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + n)
  return localDateStr(d)
}

function isCompleted(habitId: number, checkins: Checkin[], date: string): boolean {
  return checkins.some(
    (c) => c.habitId === habitId && toLocalDateString(c.date) === date && c.status === 'Completed'
  )
}

function streakUpToDate(habit: Habit, checkins: Checkin[], endDate: string): number {
  let date = endDate
  let count = 0
  for (let i = 0; i < MAX_STREAK_DAYS; i++) {
    if (date < habit.createdAt) break
    if (isScheduledForDate(habit, date)) {
      if (isCompleted(habit.id, checkins, date)) {
        count++
      } else {
        break
      }
    }
    date = subDays(date, 1)
  }
  return count
}

export function currentStreak(habit: Habit, checkins: Checkin[]): number {
  const today = todayStr()
  if (isCompleted(habit.id, checkins, today)) {
    return streakUpToDate(habit, checkins, today)
  }
  return streakUpToDate(habit, checkins, subDays(today, 1))
}

export function longestStreak(habit: Habit, checkins: Checkin[]): number {
  const today = todayStr()
  let date = habit.createdAt
  let maxStreak = 0
  let runStreak = 0
  while (date <= today) {
    if (isScheduledForDate(habit, date)) {
      if (isCompleted(habit.id, checkins, date)) {
        runStreak++
        if (runStreak > maxStreak) maxStreak = runStreak
      } else {
        runStreak = 0
      }
    }
    date = addDays(date, 1)
  }
  return maxStreak
}

export function totalCompletions(habit: Habit, checkins: Checkin[]): number {
  return checkins
    .filter((c) => c.habitId === habit.id && c.status === 'Completed')
    .reduce((sum, c) => sum + c.completedCount, 0)
}

export function weeklyCompletionRate(habit: Habit, checkins: Checkin[]): number {
  const today = todayStr()
  let scheduled = 0
  let completed = 0
  for (let i = 0; i < 7; i++) {
    const date = subDays(today, i)
    if (isScheduledForDate(habit, date)) {
      scheduled++
      if (isCompleted(habit.id, checkins, date)) completed++
    }
  }
  return scheduled === 0 ? 0 : completed / scheduled
}

export function isAtRisk(habit: Habit, checkins: Checkin[]): boolean {
  const today = todayStr()
  if (!isScheduledForDate(habit, today)) return false
  if (isCompleted(habit.id, checkins, today)) return false
  return streakUpToDate(habit, checkins, subDays(today, 1)) >= 1
}

export function goalProgress(goal: Goal, habit: Habit, checkins: Checkin[]): number {
  const value =
    goal.targetType === 'streak'
      ? currentStreak(habit, checkins)
      : totalCompletions(habit, checkins)
  return Math.min(100, Math.round((value / goal.targetValue) * 100))
}

function buildHabitSummary(habit: Habit, checkins: Checkin[]): HabitSummary {
  return {
    habitId: habit.id,
    habitName: habit.name,
    category: habit.category,
    currentStreak: currentStreak(habit, checkins),
    longestStreak: longestStreak(habit, checkins),
    totalCompletions: totalCompletions(habit, checkins),
    weeklyCompletionRate: weeklyCompletionRate(habit, checkins),
    isAtRisk: isAtRisk(habit, checkins),
  }
}

export function getDailyIntensity(days: number, checkins: Checkin[]): HeatmapDay[] {
  const today = todayStr()
  return Array.from({ length: days }, (_, i) => {
    const date = subDays(today, days - 1 - i)
    const count = checkins.filter(
      (c) => toLocalDateString(c.date) === date && c.status === 'Completed'
    ).length
    return { date, count }
  })
}

export function getWeeklyCategoryRates(habits: Habit[], checkins: Checkin[]): MiniChartItem[] {
  const activeHabits = habits.filter((h) => h.status === 'Active')
  return CATEGORIES.flatMap((category) => {
    const categoryHabits = activeHabits.filter((h) => h.category === category)
    if (categoryHabits.length === 0) return []
    const avg =
      categoryHabits.reduce((sum, h) => sum + weeklyCompletionRate(h, checkins), 0) /
      categoryHabits.length
    const value = Math.round(avg * 100)
    const color: MiniChartItem['color'] =
      value >= 70 ? 'success' : value >= 40 ? 'warning' : 'error'
    return [{ label: category as string, value, color }]
  })
}

export function getDashboard(habits: Habit[], checkins: Checkin[], goals: Goal[]): DashboardDto {
  const today = todayStr()
  const activeHabits = habits.filter((h) => h.status === 'Active')
  const scheduledToday = activeHabits.filter((h) => isScheduledForDate(h, today))
  const completedToday = scheduledToday.filter((h) => isCompleted(h.id, checkins, today))
  const percentCompletedToday =
    scheduledToday.length === 0 ? 0 : completedToday.length / scheduledToday.length
  const atRiskList = activeHabits.filter((h) => isAtRisk(h, checkins))
  const weekStart = subDays(today, 6)
  const checkInsThisWeek = checkins.filter((c) => {
    const localDate = toLocalDateString(c.date)
    return localDate >= weekStart && localDate <= today && c.status === 'Completed'
  }).length
  const achievedGoals = goals.filter((g) => {
    const habit = activeHabits.find((h) => h.id === g.habitId)
    return habit ? goalProgress(g, habit, checkins) >= 100 : false
  }).length
  const summaries = activeHabits.map((h) => buildHabitSummary(h, checkins))
  const habitsByCategory = CATEGORIES.map((category) => ({
    category,
    habits: summaries.filter((s) => s.category === category),
  })).filter((group) => group.habits.length > 0)

  return {
    summary: {
      activeHabits: activeHabits.length,
      percentCompletedToday,
      atRiskHabits: atRiskList.length,
      atRiskHabitIds: atRiskList.map((h) => h.id),
      checkInsThisWeek,
      achievedGoals,
    },
    habitsByCategory,
  }
}

export function getWeeklyCategoryStats(
  habits: Habit[],
  checkins: Checkin[]
): { name: string; value: number; percentage: number }[] {
  const today = todayStr()
  const weekStart = subDays(today, 6)
  const weekCheckins = checkins.filter((c) => {
    const localDate = toLocalDateString(c.date)
    return localDate >= weekStart && localDate <= today && c.status === 'Completed'
  })
  const activeHabits = habits.filter((h) => h.status === 'Active')
  const countByCategory = CATEGORIES.reduce(
    (acc, cat) => {
      const count = weekCheckins.filter((c) => {
        const habit = activeHabits.find((h) => h.id === c.habitId)
        return habit?.category === cat
      }).length
      return { ...acc, [cat]: count }
    },
    {} as Record<string, number>
  )
  const total = Object.values(countByCategory).reduce((a, b) => a + b, 0)
  if (total === 0) return []
  return CATEGORIES.filter((cat) => countByCategory[cat] > 0).map((cat) => ({
    name: cat as string,
    value: countByCategory[cat],
    percentage: Math.round((countByCategory[cat] / total) * 100),
  }))
}
