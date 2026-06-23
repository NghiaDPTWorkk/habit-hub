import { useCallback, useMemo } from 'react'
import { useBoundStore } from '@/store'
import { makeCheckinKey } from '@/store/checkinSlice'
import { getLocalDateString } from '@/utils'
import type { Checkin, CheckinStatus } from '@/types'

function computeStatus(completedCount: number, targetPerDay: number): CheckinStatus {
  if (completedCount === 0) return 'Not Started'
  if (completedCount >= targetPerDay) return 'Completed'
  return 'In Progress'
}

export function useCheckinStore() {
  const checkins = useBoundStore((state) => state.checkins)
  const addCheckin = useBoundStore((state) => state.addCheckin)
  const updateCheckin = useBoundStore((state) => state.updateCheckin)
  const deleteCheckin = useBoundStore((state) => state.deleteCheckin)
  const habits = useBoundStore((state) => state.habits)
  const previousCheckins = useBoundStore((state) => state.previousCheckins)
  const undoLastCheckin = useBoundStore((state) => state.undoLastCheckin)

  const today = getLocalDateString()

  const getCheckinByHabitAndDate = useCallback(
    (habitId: number, date: string): Checkin | undefined => checkins[makeCheckinKey(habitId, date)],
    [checkins]
  )

  const todayCheckins = useMemo(
    () => Object.values(checkins).filter((c) => c.date === today),
    [checkins, today]
  )

  const checkinsByDate = useMemo(
    () =>
      Object.values(checkins).reduce<Record<string, Checkin[]>>((acc, c) => {
        ;(acc[c.date] ??= []).push(c)
        return acc
      }, {}),
    [checkins]
  )

  const todayProgress = useMemo(() => {
    const activeHabits = habits.filter((h) => h.status === 'Active')
    if (activeHabits.length === 0) return 0
    const activeHabitIds = new Set(activeHabits.map((h) => h.id))
    const completedCount = todayCheckins.filter(
      (c) => c.status === 'Completed' && activeHabitIds.has(c.habitId)
    ).length
    return Math.min(Math.round((completedCount / activeHabits.length) * 100), 100)
  }, [habits, todayCheckins])

  const upsertCheckin = useCallback(
    (habitId: number, date: string, updates: Partial<Omit<Checkin, 'habitId' | 'date'>>) => {
      if (date > getLocalDateString()) return

      let safeUpdates = updates
      if (updates.completedCount !== undefined) {
        const habit = habits.find((h) => h.id === habitId)
        if (habit) {
          const capped = Math.min(Math.max(updates.completedCount, 0), habit.targetPerDay)
          safeUpdates = {
            ...updates,
            completedCount: capped,
            status: computeStatus(capped, habit.targetPerDay),
          }
        }
      }

      const existing = getCheckinByHabitAndDate(habitId, date)
      if (existing) {
        updateCheckin(habitId, date, safeUpdates)
      } else {
        addCheckin({ habitId, date, completedCount: 0, status: 'Not Started', ...safeUpdates })
      }
    },
    [habits, getCheckinByHabitAndDate, addCheckin, updateCheckin]
  )

  const markComplete = useCallback(
    (habitId: number, date: string) => {
      const habit = habits.find((h) => h.id === habitId)
      if (!habit) return
      upsertCheckin(habitId, date, { completedCount: habit.targetPerDay, status: 'Completed' })
    },
    [habits, upsertCheckin]
  )

  const incrementCount = useCallback(
    (habitId: number, date: string) => {
      const habit = habits.find((h) => h.id === habitId)
      if (!habit) return
      const existing = getCheckinByHabitAndDate(habitId, date)
      const newCount = Math.min((existing?.completedCount ?? 0) + 1, habit.targetPerDay)
      upsertCheckin(habitId, date, {
        completedCount: newCount,
        status: computeStatus(newCount, habit.targetPerDay),
      })
    },
    [habits, getCheckinByHabitAndDate, upsertCheckin]
  )

  const decrementCount = useCallback(
    (habitId: number, date: string) => {
      const habit = habits.find((h) => h.id === habitId)
      if (!habit) return
      const existing = getCheckinByHabitAndDate(habitId, date)
      const newCount = Math.max((existing?.completedCount ?? 0) - 1, 0)
      upsertCheckin(habitId, date, {
        completedCount: newCount,
        status: computeStatus(newCount, habit.targetPerDay),
      })
    },
    [habits, getCheckinByHabitAndDate, upsertCheckin]
  )

  return {
    today,
    checkins,
    todayCheckins,
    checkinsByDate,
    todayProgress,
    previousCheckins,
    getCheckinByHabitAndDate,
    upsertCheckin,
    markComplete,
    incrementCount,
    decrementCount,
    deleteCheckin,
    undoLastCheckin,
  }
}
