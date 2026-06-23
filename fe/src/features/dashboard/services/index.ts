import type { Habit, Checkin, Goal, Category } from '@/types'
import type { HabitSummary, DashboardDto } from '@/types'
import { isScheduledForDate } from '@/features/habits/services/ScheduleService'
import type { HeatmapDay } from '@/components/ui/CalendarHeatmap'
import type { MiniChartItem } from '@/components/ui/MiniChart'

const CATEGORIES: Category[] = ['Health', 'Study', 'Work', 'Mindfulness', 'Other']
const MAX_STREAK_DAYS = 365

// Returns YYYY-MM-DD in the browser's local timezone.
function localDateStr(d: Date): string {
  return d.toLocaleDateString('en-CA') // en-CA locale always formats as YYYY-MM-DD
}

/** Returns today's date as YYYY-MM-DD in local time. O(1). */
export function todayStr(): string {
  return localDateStr(new Date())
}

/** Subtracts n calendar days from dateStr and returns YYYY-MM-DD. O(1). */
export function subDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T12:00:00') // local noon avoids DST edge cases
  d.setDate(d.getDate() - n)
  return localDateStr(d)
}

/** Adds n calendar days to dateStr and returns YYYY-MM-DD. O(1). */
export function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + n)
  return localDateStr(d)
}

/**
 * Returns true if habitId has a Completed check-in on the given date.
 * O(C) — linear scan over checkins array (C = total checkins).
 */
function isCompleted(habitId: number, checkins: Checkin[], date: string): boolean {
  return checkins.some((c) => c.habitId === habitId && c.date === date && c.status === 'Completed')
}

/**
 * Walks backwards from endDate, counting consecutive scheduled+completed days.
 * Stops at the habit's createdAt boundary or the first missed day.
 * O(D × C) — up to D = MAX_STREAK_DAYS iterations, each calling isCompleted O(C).
 */
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

/**
 * Returns the habit's active streak as of today.
 * Counts today if already completed; otherwise counts from yesterday.
 * O(D × C) via streakUpToDate.
 */
export function currentStreak(habit: Habit, checkins: Checkin[]): number {
  const today = todayStr()
  if (isCompleted(habit.id, checkins, today)) {
    return streakUpToDate(habit, checkins, today)
  }
  return streakUpToDate(habit, checkins, subDays(today, 1))
}

/**
 * Scans every scheduled day from habit.createdAt to today and tracks the longest
 * unbroken run of completions.
 * O(L × C) — L = days from creation to today (can be large for old habits), C = checkins.
 */
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

/**
 * Counts all Completed check-ins for this habit across all time.
 * O(C) — single pass over checkins.
 */
export function totalCompletions(habit: Habit, checkins: Checkin[]): number {
  return checkins.filter((c) => c.habitId === habit.id && c.status === 'Completed').length
}

/**
 * Returns completion rate (0–1) over the last 7 days.
 * Only counts days the habit was scheduled; returns 0 if none scheduled.
 * O(7 × C) = O(C).
 */
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

/**
 * Returns true when a habit is "at risk": scheduled today, not yet completed,
 * and had at least a 1-day streak going into today (i.e. streak would break).
 * O(D × C) via streakUpToDate.
 */
export function isAtRisk(habit: Habit, checkins: Checkin[]): boolean {
  const today = todayStr()
  if (!isScheduledForDate(habit, today)) return false
  if (isCompleted(habit.id, checkins, today)) return false
  return streakUpToDate(habit, checkins, subDays(today, 1)) >= 1
}

/**
 * Returns goal progress as a percentage (0–100, capped).
 * Delegates to currentStreak for streak goals, totalCompletions for count goals.
 * O(D × C) when targetType === 'streak'; O(C) when targetType === 'total'.
 */
export function goalProgress(goal: Goal, habit: Habit, checkins: Checkin[]): number {
  const value =
    goal.targetType === 'streak'
      ? currentStreak(habit, checkins)
      : totalCompletions(habit, checkins)
  return Math.min(100, Math.round((value / goal.targetValue) * 100))
}

/** Builds a full HabitSummary for one habit. O(D × C) — dominated by streak calculations. */
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

/**
 * Produces `days` HeatmapDay entries ending today, each holding the count of
 * Completed check-ins on that date (across all habits).
 * O(days × C) — for each of the `days` dates, scans the full checkins array.
 */
export function getDailyIntensity(days: number, checkins: Checkin[]): HeatmapDay[] {
  const today = todayStr()
  return Array.from({ length: days }, (_, i) => {
    const date = subDays(today, days - 1 - i)
    const count = checkins.filter((c) => c.date === date && c.status === 'Completed').length
    return { date, count }
  })
}

/**
 * Computes the 7-day average completion rate per category for the mini bar chart.
 * O(H × C) — iterates over active habits (H) and calls weeklyCompletionRate O(C) each.
 */
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

/**
 * Aggregates all KPI figures and per-habit summaries needed by the dashboard.
 * O(H × D × C) — each active habit requires streak computation O(D × C),
 * where H = active habits, D ≤ MAX_STREAK_DAYS, C = total checkins.
 */
export function getDashboard(habits: Habit[], checkins: Checkin[], goals: Goal[]): DashboardDto {
  const today = todayStr()
  const activeHabits = habits.filter((h) => h.status === 'Active')
  const scheduledToday = activeHabits.filter((h) => isScheduledForDate(h, today))
  const completedToday = scheduledToday.filter((h) => isCompleted(h.id, checkins, today))
  const percentCompletedToday =
    scheduledToday.length === 0 ? 0 : completedToday.length / scheduledToday.length
  const atRiskList = activeHabits.filter((h) => isAtRisk(h, checkins))
  const weekStart = subDays(today, 6)
  const checkInsThisWeek = checkins.filter(
    (c) => c.date >= weekStart && c.date <= today && c.status === 'Completed'
  ).length
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

/**
 * Returns completed check-in counts grouped by category for the current week (last 7 days).
 * Used by CategoryDistributionChart to compute the pie slice percentages.
 * O(Cat × C) — for each category, scans the week's check-ins (C filtered to 7 days).
 */
export function getWeeklyCategoryStats(
  habits: Habit[],
  checkins: Checkin[]
): { name: string; value: number; percentage: number }[] {
  const today = todayStr()
  const weekStart = subDays(today, 6)
  const weekCheckins = checkins.filter(
    (c) => c.date >= weekStart && c.date <= today && c.status === 'Completed'
  )
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
