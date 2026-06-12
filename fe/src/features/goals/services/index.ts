import type { Goal, Checkin } from '@/types'

export const computeStreak = (habitId: number, checkins: Checkin[]): number => {
  const completed = checkins
    .filter((c) => c.habitId === habitId && c.status === 'Completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (completed.length === 0) return 0

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let expectedDate = new Date(today)

  for (const checkin of completed) {
    const checkinDate = new Date(checkin.date)
    checkinDate.setHours(0, 0, 0, 0)
    const diffDays = (expectedDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24)

    if (streak === 0 && diffDays <= 1) {
      streak++
      expectedDate = new Date(checkinDate)
      expectedDate.setDate(expectedDate.getDate() - 1)
    } else if (streak > 0 && diffDays === 0) {
      streak++
      expectedDate.setDate(expectedDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

export const computeTotalCompletions = (habitId: number, checkins: Checkin[]): number =>
  checkins
    .filter((c) => c.habitId === habitId && c.status === 'Completed')
    .reduce((sum, c) => sum + c.completedCount, 0)

export const computeCurrentValue = (goal: Goal, checkins: Checkin[]): number =>
  goal.targetType === 'streak'
    ? computeStreak(goal.habitId, checkins)
    : computeTotalCompletions(goal.habitId, checkins)
