import type { Habit } from '@/types'
import { alpha, type Theme } from '@mui/material/styles'

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

/**
 * Gets the color associated with a habit's priority.
 */
export const getPriorityColor = (priority: string, theme: Theme): string => {
  if (priority === 'High') return theme.palette.error.main
  if (priority === 'Medium') return theme.palette.warning.main
  return theme.palette.text.secondary
}

/**
 * Gets the background and text colors for a habit's category.
 */
export const getCategoryColors = (category: string, theme: Theme) => {
  switch (category) {
    case 'Health':
      return {
        bg: theme.palette.success.light ? alpha(theme.palette.success.main, 0.1) : '#e8f5e9',
        text: theme.palette.success.main,
      }
    case 'Study':
      return {
        bg: theme.palette.info.light ? alpha(theme.palette.info.main, 0.1) : '#e3f2fd',
        text: theme.palette.info.main,
      }
    case 'Work':
      return {
        bg: theme.palette.secondary.light ? alpha(theme.palette.secondary.main, 0.1) : '#f3e5f5',
        text: theme.palette.secondary.main,
      }
    case 'Mindfulness':
      return {
        bg: theme.palette.primary.light ? alpha(theme.palette.primary.main, 0.1) : '#e0f2f1',
        text: theme.palette.primary.main,
      }
    default:
      return {
        bg: theme.palette.text.secondary ? alpha(theme.palette.text.secondary, 0.1) : '#f5f5f5',
        text: theme.palette.text.secondary,
      }
  }
}
