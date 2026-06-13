import dayjs, { type Dayjs } from 'dayjs'
import type { Habit, Checkin } from '@/types'

export function getActiveHabitsForDay(habits: Habit[], day: Dayjs): Habit[] {
  const dayOfWeek = day.day()
  return habits.filter((h) => {
    if (h.status !== 'Active') return false
    if (h.frequency !== 'Daily' && !h.specificDays?.includes(dayOfWeek)) return false
    return true
  })
}

export function getDayStatus(
  day: Dayjs,
  habits: Habit[],
  getCheckinByHabitAndDate: (habitId: number, date: string) => Checkin | null | undefined
): 'completed' | 'overdue' | 'none' {
  const dStr = day.format('YYYY-MM-DD')
  const todayStr = dayjs().format('YYYY-MM-DD')

  const dayHabits = getActiveHabitsForDay(habits, day)

  if (dayHabits.length === 0) return 'none'

  const allCompleted = dayHabits.every((h) => {
    const c = getCheckinByHabitAndDate(h.id, dStr)
    return c && c.completedCount >= h.targetPerDay
  })

  if (allCompleted) return 'completed'
  if (dStr < todayStr) return 'overdue'
  return 'none'
}
