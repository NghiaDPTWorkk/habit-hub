import type { Checkin, Habit } from '@/types'

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

export function getDateLabel(): string {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export interface SelectedDateDetail {
  date: string
  count: number
  tasks: Array<{
    name: string
    category: string
    completedCount: number
    targetPerDay: number
  }>
}

export function getSelectedDateDetails(
  selectedDate: string | null,
  checkins: Record<string, Checkin>,
  habits: Habit[]
): SelectedDateDetail | null {
  if (!selectedDate) return null
  const dayCheckins = Object.values(checkins).filter(
    (c) => c.date === selectedDate && c.completedCount > 0
  )

  const completedTasks = dayCheckins.map((c) => {
    const habit = habits.find((h) => h.id === c.habitId)
    return {
      name: habit ? habit.name : `Habit #${c.habitId}`,
      category: habit ? habit.category : 'General',
      completedCount: c.completedCount,
      targetPerDay: habit ? habit.targetPerDay : 1,
    }
  })

  return {
    date: new Date(selectedDate).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    count: completedTasks.length,
    tasks: completedTasks,
  }
}
