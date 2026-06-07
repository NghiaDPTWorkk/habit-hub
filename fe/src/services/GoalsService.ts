import type { Goal, GoalInput } from '@/types'
import { AppError } from '@/domain/AppError'
import { ERR } from '@/domain/errorCodes'
import { GoalInputSchema, zodToAppError } from '@/schemas/validators'
import { useBoundStore } from '@/store/useBoundStore'
import { today } from '@/utils/dateUtils'
import { getHabit } from './HabitsService'
import { goalProgress } from './StatsService'

export function createGoal(habitId: string, input: GoalInput): Goal {
  getHabit(habitId) // throws if habit not found

  const result = GoalInputSchema.safeParse(input)
  if (!result.success) throw zodToAppError(result.error)

  const { goals } = useBoundStore.getState()
  const activeExists = goals.some((g) => g.habitId === habitId && g.status === 'ACTIVE')
  if (activeExists) {
    throw new AppError(ERR.GOAL.ACTIVE_EXISTS, 'An active goal already exists for this habit')
  }

  const goal: Goal = {
    id: crypto.randomUUID(),
    habitId,
    targetType: result.data.targetType,
    targetValue: result.data.targetValue,
    status: 'ACTIVE',
    progressPercent: 0,
    lastThresholdNotified: 'NONE',
    achievedAt: null,
    createdAt: today(),
  }

  useBoundStore.getState().upsertGoal(goal)
  return goal
}

export function getActiveGoal(habitId: string): Goal | null {
  const { goals, habits, checkIns } = useBoundStore.getState()

  const active = goals
    .filter((g) => g.habitId === habitId && g.status === 'ACTIVE')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]

  if (active) {
    const habit = habits.find((h) => h.id === habitId)
    if (habit) {
      return { ...active, progressPercent: goalProgress(active, habit, checkIns) }
    }
    return active
  }

  // Fall back to most recent achieved
  const achieved = goals
    .filter((g) => g.habitId === habitId && g.status === 'ACHIEVED')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]

  if (achieved) {
    return { ...achieved, progressPercent: 100 }
  }

  return null
}

export function evaluateThresholds(habitId: string): void {
  const { goals, habits, checkIns } = useBoundStore.getState()
  const goal = goals.find((g) => g.habitId === habitId && g.status === 'ACTIVE')
  if (!goal) return

  const habit = habits.find((h) => h.id === habitId)
  if (!habit) return

  const progress = goalProgress(goal, habit, checkIns)
  let updated = { ...goal }

  if (progress >= 100 && goal.lastThresholdNotified !== 'ONE_HUNDRED') {
    updated = {
      ...updated,
      status: 'ACHIEVED',
      lastThresholdNotified: 'ONE_HUNDRED',
      achievedAt: today(),
      progressPercent: 100,
    }
  } else if (progress >= 80 && goal.lastThresholdNotified === 'NONE') {
    updated = {
      ...updated,
      lastThresholdNotified: 'EIGHTY',
      progressPercent: progress,
    }
  } else {
    updated = { ...updated, progressPercent: progress }
  }

  useBoundStore.getState().upsertGoal(updated)
}
