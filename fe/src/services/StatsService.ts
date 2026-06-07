import type { Habit, CheckIn, Goal, HabitSummary, DashboardDto, Category } from '@/types'
import { today, subDaysFromDate, last7Days } from '@/utils/dateUtils'
import { isScheduledOn } from './ScheduleService'
import { eachDayBetween } from '@/utils/dateUtils'

function isCompleted(checkIns: CheckIn[], habitId: string, date: string, target: number): boolean {
  const ci = checkIns.find((c) => c.habitId === habitId && c.date === date)
  return ci ? ci.completedCount >= target : false
}

export function currentStreak(habit: Habit, checkIns: CheckIn[]): number {
  const t = today()
  let streak = 0

  for (let i = 0; i <= 365; i++) {
    const cursor = subDaysFromDate(t, i)
    if (!isScheduledOn(habit, cursor)) continue
    if (isCompleted(checkIns, habit.id, cursor, habit.targetPerDay)) {
      streak++
    } else {
      break
    }
  }
  return streak
}

export function longestStreak(habit: Habit, checkIns: CheckIn[]): number {
  const start = habit.createdAt
  const end = today()
  const days = eachDayBetween(start, end)

  let longest = 0
  let current = 0

  for (const day of days) {
    if (!isScheduledOn(habit, day)) continue
    if (isCompleted(checkIns, habit.id, day, habit.targetPerDay)) {
      current++
      if (current > longest) longest = current
    } else {
      current = 0
    }
  }
  return longest
}

export function totalCompletions(habit: Habit, checkIns: CheckIn[]): number {
  return checkIns.filter((c) => c.habitId === habit.id && c.completedCount >= habit.targetPerDay)
    .length
}

export function weeklyCompletionRate(habit: Habit, checkIns: CheckIn[]): number {
  const days = last7Days()
  const scheduled = days.filter((d) => isScheduledOn(habit, d))
  if (scheduled.length === 0) return 0
  const completed = scheduled.filter((d) => isCompleted(checkIns, habit.id, d, habit.targetPerDay))
  return completed.length / scheduled.length
}

export function goalProgress(goal: Goal, habit: Habit, checkIns: CheckIn[]): number {
  if (goal.targetType === 'STREAK') {
    const streak = currentStreak(habit, checkIns)
    return Math.min(100, Math.round((streak / goal.targetValue) * 100))
  }
  const total = totalCompletions(habit, checkIns)
  return Math.min(100, Math.round((total / goal.targetValue) * 100))
}

export function isAtRisk(habit: Habit, checkIns: CheckIn[]): boolean {
  const t = today()
  if (!isScheduledOn(habit, t)) return false
  if (isCompleted(checkIns, habit.id, t, habit.targetPerDay)) return false
  return currentStreak(habit, checkIns) >= 1
}

export function getDashboard(habits: Habit[], checkIns: CheckIn[], goals: Goal[]): DashboardDto {
  const t = today()
  const activeHabits = habits.filter((h) => h.status === 'ACTIVE')

  const scheduledToday = activeHabits.filter((h) => isScheduledOn(h, t))
  const completedToday = scheduledToday.filter((h) =>
    isCompleted(checkIns, h.id, t, h.targetPerDay)
  )
  const percentCompletedToday =
    scheduledToday.length === 0 ? 0 : completedToday.length / scheduledToday.length

  const atRiskList = activeHabits.filter((h) => isAtRisk(h, checkIns))

  const weekDays = last7Days()
  const checkInsThisWeek = checkIns.filter(
    (c) => weekDays.includes(c.date) && c.completedCount > 0
  ).length

  const achievedGoals = goals.filter((g) => g.status === 'ACHIEVED').length

  const categories = Array.from(new Set(activeHabits.map((h) => h.category))) as Category[]
  const habitsByCategory = categories.map((cat) => {
    const catHabits = activeHabits.filter((h) => h.category === cat)
    const summaries: HabitSummary[] = catHabits.map((habit) => {
      const activeGoal = goals.find((g) => g.habitId === habit.id && g.status === 'ACTIVE') ?? null
      return {
        habit,
        currentStreak: currentStreak(habit, checkIns),
        longestStreak: longestStreak(habit, checkIns),
        totalCompletions: totalCompletions(habit, checkIns),
        weeklyCompletionRate: weeklyCompletionRate(habit, checkIns),
        todayCompleted: isCompleted(checkIns, habit.id, t, habit.targetPerDay),
        isAtRisk: isAtRisk(habit, checkIns),
        activeGoal,
      }
    })
    return { category: cat, habits: summaries }
  })

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
