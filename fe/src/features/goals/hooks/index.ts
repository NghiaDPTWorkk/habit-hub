import { useEffect } from 'react'
import { useBoundStore } from '@/store/useBoundStore'
import { SHARED_MESSAGES } from '@/constants/messages'
import { GOALS_CONTENT } from '../constants/content'
import { computeCurrentValue } from '../services'

export const useGoalMilestoneNotifications = (): void => {
  const goals = useBoundStore((s) => s.goals)
  const checkins = useBoundStore((s) => s.checkins)
  const habits = useBoundStore((s) => s.habits)
  const getGoalProgress = useBoundStore((s) => s.getGoalProgress)
  const reachedMilestones = useBoundStore((s) => s.reachedMilestones)
  const markMilestoneReached = useBoundStore((s) => s.markMilestoneReached)
  const showToast = useBoundStore((s) => s.showToast)

  useEffect(() => {
    goals.forEach((goal) => {
      const currentValue = computeCurrentValue(goal, checkins)
      const progress = getGoalProgress(goal, currentValue)
      const habitName =
        habits.find((h) => h.id === goal.habitId)?.name ?? GOALS_CONTENT.UNKNOWN_HABIT

      const key100 = `${goal.id}-100`
      const key80 = `${goal.id}-80`

      if (progress.isCompleted && !reachedMilestones[key100]) {
        markMilestoneReached(key100)
        // AC1: also mark 80% to prevent it firing if progress later drops to 80-99%
        markMilestoneReached(key80)
        showToast(SHARED_MESSAGES.GOALS.COMPLETED(habitName), 'success')
      } else if (progress.isEightyPercentReached && !reachedMilestones[key80]) {
        markMilestoneReached(key80)
        showToast(SHARED_MESSAGES.GOALS.AT_80_PERCENT(habitName), 'info')
      }
      // AC2: reachedMilestones is persisted — once key100 is set, undo+redo
      // within the same session or across reloads will not re-fire the toast.
    })
  }, [goals, checkins, habits, getGoalProgress, reachedMilestones, markMilestoneReached, showToast])
}
