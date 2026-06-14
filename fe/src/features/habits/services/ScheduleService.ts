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
