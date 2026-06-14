import { useEffect } from 'react'
import { useBoundStore } from '@/store/useBoundStore'
import { SHARED_MESSAGES } from '@/constants/messages'
import { GOALS_CONTENT } from '../constants/content'

export const useGoalMilestoneNotifications = (): void => {
  const goals = useBoundStore((s) => s.goals)
  const checkins = useBoundStore((s) => s.checkins)
  const habits = useBoundStore((s) => s.habits)
  const getGoalProgress = useBoundStore((s) => s.getGoalProgress)
  const notifiedGoals = useBoundStore((s) => s.notifiedGoals)
  const markGoalNotified = useBoundStore((s) => s.markGoalNotified)
  const showToast = useBoundStore((s) => s.showToast)

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
        // AC1: also mark 80% to prevent it firing if progress later drops to 80-99%
        markGoalNotified(at80Key)
        showToast(SHARED_MESSAGES.GOALS.COMPLETED(habitName), 'success')
      } else if (progress.isAt80Percent && !notifiedGoals[at80Key]) {
        markGoalNotified(at80Key)
        showToast(SHARED_MESSAGES.GOALS.AT_80_PERCENT(habitName), 'warning')
      }
    })
  }, [goals, checkins, habits, getGoalProgress, notifiedGoals, markGoalNotified, showToast])
}
