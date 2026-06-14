import type { Habit } from '@/types'

/**
 * String representation of today's date in YYYY-MM-DD format.
 */
export const todayString = new Date().toISOString().split('T')[0]

/**
 * Day index of today (0-6, where 0 is Sunday).
 */
export const todayWeekDay = new Date().getDay()

/**
 * Checks whether a habit is scheduled for today.
 */
export const isDueToday = (habit: Habit): boolean => {
  if (habit.frequency === 'Daily') {
    return true
  }
  return Array.isArray(habit.specificDays) && habit.specificDays.includes(todayWeekDay)
}

/**
 * Determines if a habit has been missed today.
 */
export const isHabitMissed = (
  habit: Habit,
  todayCheckinByHabit: Record<number, { completedCount: number }>
): boolean => {
  if (habit.status !== 'Active') {
    return false
  }
  if (!isDueToday(habit)) {
    return false
  }
  const todayCheckin = todayCheckinByHabit[habit.id]
  return !todayCheckin || todayCheckin.completedCount < habit.targetPerDay
}
