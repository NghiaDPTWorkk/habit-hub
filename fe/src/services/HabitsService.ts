import type { Habit, HabitInput, HabitFilters, HabitStatus } from '@/types'
import { AppError } from '@/domain/AppError'
import { ERR } from '@/domain/errorCodes'
import { HabitInputSchema, zodToAppError } from '@/schemas/validators'
import { useBoundStore } from '@/store/useBoundStore'
import { today } from '@/utils/dateUtils'

const PRIORITY_ORDER: Record<Habit['priority'], number> = { HIGH: 0, MEDIUM: 1, LOW: 2 }

function sortHabits(habits: Habit[]): Habit[] {
  return [...habits].sort((a, b) => {
    const pd = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    if (pd !== 0) return pd
    return a.name.localeCompare(b.name)
  })
}

// Valid status transitions
const ALLOWED_TRANSITIONS: Record<HabitStatus, HabitStatus[]> = {
  ACTIVE: ['PAUSED', 'ARCHIVED'],
  PAUSED: ['ACTIVE', 'ARCHIVED'],
  ARCHIVED: ['ACTIVE'],
}

export function listHabits(filters?: HabitFilters): Habit[] {
  const { habits } = useBoundStore.getState()
  let result = habits

  if (!filters?.status) {
    result = result.filter((h) => h.status !== 'ARCHIVED')
  } else {
    result = result.filter((h) => h.status === filters.status)
  }

  if (filters?.category) result = result.filter((h) => h.category === filters.category)
  if (filters?.frequencyType)
    result = result.filter((h) => h.frequencyType === filters.frequencyType)
  if (filters?.priority) result = result.filter((h) => h.priority === filters.priority)

  return sortHabits(result)
}

export function getHabit(id: string): Habit {
  const { habits } = useBoundStore.getState()
  const habit = habits.find((h) => h.id === id)
  if (!habit) throw new AppError(ERR.HABIT.NOT_FOUND, `Habit ${id} not found`)
  return habit
}

export function createHabit(input: HabitInput): Habit {
  const result = HabitInputSchema.safeParse(input)
  if (!result.success) throw zodToAppError(result.error)

  const now = today()
  const habit: Habit = {
    ...result.data,
    id: crypto.randomUUID(),
    status: 'ACTIVE',
    createdAt: now,
    updatedAt: now,
  }

  useBoundStore.getState().upsertHabit(habit)
  return habit
}

export function updateHabit(id: string, input: HabitInput): Habit {
  const existing = getHabit(id)
  const result = HabitInputSchema.safeParse(input)
  if (!result.success) throw zodToAppError(result.error)

  const updated: Habit = {
    ...existing,
    ...result.data,
    updatedAt: today(),
  }

  useBoundStore.getState().upsertHabit(updated)
  return updated
}

export function deleteHabit(id: string): void {
  getHabit(id) // throws if not found
  const store = useBoundStore.getState()
  store.removeHabit(id)
  store.removeCheckInsForHabit(id)
  store.removeGoalForHabit(id)
}

export function changeStatus(id: string, target: HabitStatus): Habit {
  const habit = getHabit(id)
  const allowed = ALLOWED_TRANSITIONS[habit.status]
  if (!allowed.includes(target)) {
    throw new AppError(
      ERR.HABIT.STATUS_TRANSITION,
      `Cannot transition from ${habit.status} to ${target}`
    )
  }

  const updated: Habit = { ...habit, status: target, updatedAt: today() }
  useBoundStore.getState().upsertHabit(updated)
  return updated
}
