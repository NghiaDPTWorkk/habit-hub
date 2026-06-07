import type { CheckIn, CheckInInput, DateRange } from '@/types'
import { AppError } from '@/domain/AppError'
import { ERR } from '@/domain/errorCodes'
import { useBoundStore } from '@/store/useBoundStore'
import { today, subDaysFromDate, isFutureDate } from '@/utils/dateUtils'
import { isScheduledOn } from './ScheduleService'
import { getHabit } from './HabitsService'
import { evaluateThresholds } from './GoalsService'

function computeCompletionStatus(count: number, target: number): CheckIn['completionStatus'] {
  if (count <= 0) return 'NOT_STARTED'
  if (count >= target) return 'COMPLETED'
  return 'IN_PROGRESS'
}

export function upsertCheckIn(input: CheckInInput): CheckIn {
  const { habitId, date, completedCount, note } = input

  if (isFutureDate(date)) {
    throw new AppError(ERR.CHECKIN.FUTURE_DATE, "Future dates can't be checked in")
  }

  const habit = getHabit(habitId)

  if (!isScheduledOn(habit, date)) {
    throw new AppError(ERR.CHECKIN.NOT_SCHEDULED, 'This habit is not scheduled on this day')
  }

  if (completedCount < 0 || completedCount > habit.targetPerDay) {
    throw new AppError(
      ERR.CHECKIN.COUNT_EXCEEDS_TARGET,
      'Completed count cannot exceed daily target'
    )
  }

  const { checkIns } = useBoundStore.getState()
  const existing = checkIns.find((c) => c.habitId === habitId && c.date === date)

  const checkIn: CheckIn = {
    id: existing?.id ?? crypto.randomUUID(),
    habitId,
    date,
    completedCount,
    note: note ?? null,
    completionStatus: computeCompletionStatus(completedCount, habit.targetPerDay),
  }

  useBoundStore.getState().upsertCheckIn(checkIn)

  evaluateThresholds(habitId)

  return checkIn
}

export function listCheckIns(habitId: string, range?: DateRange): CheckIn[] {
  const { checkIns } = useBoundStore.getState()
  const t = today()
  const defaultStart = subDaysFromDate(t, 29)
  const start = range?.start ?? defaultStart
  const end = range?.end ?? t

  return checkIns.filter((c) => c.habitId === habitId && c.date >= start && c.date <= end)
}

export function getGroupedCheckIns(date: string): CheckIn[] {
  const { habits, checkIns } = useBoundStore.getState()
  const activeHabits = habits.filter((h) => h.status === 'ACTIVE')
  const scheduledHabits = activeHabits.filter((h) => isScheduledOn(h, date))

  return scheduledHabits.map((habit) => {
    const existing = checkIns.find((c) => c.habitId === habit.id && c.date === date)
    if (existing) {
      // Recompute completion status on read
      return {
        ...existing,
        completionStatus: computeCompletionStatus(existing.completedCount, habit.targetPerDay),
      }
    }
    return {
      id: null,
      habitId: habit.id,
      date,
      completedCount: 0,
      note: null,
      completionStatus: 'NOT_STARTED' as const,
    }
  })
}
