import type { Habit } from '@/types'
import { getDayOfWeek } from '@/utils/dateUtils'

export function isScheduledOn(habit: Habit, date: string): boolean {
  if (habit.frequencyType === 'DAILY') return true
  const dow = getDayOfWeek(date)
  return habit.daysOfWeek.includes(dow)
}
