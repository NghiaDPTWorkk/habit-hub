import { getLocalDateString } from '@/utils'
import type { Habit } from '@/types'

/**
 * Returns true if the habit is scheduled on the given YYYY-MM-DD date.
 * Archived and Paused habits are never scheduled.
 */
export function isScheduledForDate(habit: Habit, date: string): boolean {
  if (habit.status === 'Archived' || habit.status === 'Paused') return false
  if (habit.frequency === 'Daily') return true
  if (habit.frequency === 'Specific') {
    if (!habit.specificDays) return false
    const dayOfWeek = new Date(date).getDay()
    return habit.specificDays.includes(dayOfWeek)
  }
  return false
}

/**
 * Returns an array of YYYY-MM-DD strings (inclusive) when the habit is
 * scheduled between startDate and endDate.
 */
export function getScheduledDatesInRange(
  habit: Habit,
  startDate: string,
  endDate: string
): string[] {
  const result: string[] = []
  const current = new Date(startDate)
  const end = new Date(endDate)

  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0]
    if (isScheduledForDate(habit, dateStr)) {
      result.push(dateStr)
    }
    current.setDate(current.getDate() + 1)
  }

  return result
}

/**
 * Returns true if the habit is scheduled for today.
 */
export function isScheduledToday(habit: Habit): boolean {
  return isScheduledForDate(habit, getLocalDateString())
}

/**
 * Returns the days of the week (0=Sun … 6=Sat) on which the habit is scheduled.
 * Daily habits return all seven days; Specific habits return their specificDays.
 */
export function getScheduledDaysOfWeek(habit: Habit): number[] {
  if (habit.frequency === 'Daily') return [0, 1, 2, 3, 4, 5, 6]
  return habit.specificDays ?? []
}
