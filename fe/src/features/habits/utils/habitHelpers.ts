import type { Habit } from '@/types'

export const todayString = new Date().toISOString().split('T')[0]
export const todayWeekDay = new Date().getDay()

export const isDueToday = (habit: Habit): boolean => {
  if (habit.frequency === 'Daily') {
    return true
  }
  return Array.isArray(habit.specificDays) && habit.specificDays.includes(todayWeekDay)
}

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
