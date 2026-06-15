import { useEffect } from 'react'
import { useBoundStore } from '@/store/useBoundStore'
import { GOALS_CONTENT } from '../constants/content'

export const useGoalMilestoneNotifications = (
  onAt80Percent?: (habitName: string) => void,
  onCompleted?: (habitName: string) => void
): void => {
  const goals = useBoundStore((s) => s.goals)
  const checkins = useBoundStore((s) => s.checkins)
  const habits = useBoundStore((s) => s.habits)
  const getGoalProgress = useBoundStore((s) => s.getGoalProgress)
  const notifiedGoals = useBoundStore((s) => s.notifiedGoals)
  const markGoalNotified = useBoundStore((s) => s.markGoalNotified)

  useEffect(() => {
    const checkinList = Object.values(checkins)
    goals.forEach((goal) => {
      const progress = getGoalProgress(goal, checkinList)
      const habitName =
        habits.find((h) => h.id === goal.habitId)?.name ?? GOALS_CONTENT.UNKNOWN_HABIT
      const completedKey = `${goal.id}-completed`
      const at80Key = `${goal.id}-80percent`

      if (progress.isCompleted && !notifiedGoals[completedKey]) {
        markGoalNotified(completedKey)
        markGoalNotified(at80Key)
        onCompleted?.(habitName)
      } else if (progress.isAt80Percent && !notifiedGoals[at80Key]) {
        markGoalNotified(at80Key)
        onAt80Percent?.(habitName)
      }
    })
  }, [
    goals,
    checkins,
    habits,
    getGoalProgress,
    notifiedGoals,
    markGoalNotified,
    onAt80Percent,
    onCompleted,
  ])
}
