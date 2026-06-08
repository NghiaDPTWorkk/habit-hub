import { useMemo } from 'react'
import { useBoundStore } from '@/store'
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

  const today = new Date().toISOString().split('T')[0]

  const todayCheckins = useMemo(() => checkins.filter((c) => c.date === today), [checkins, today])

  const checkinsByDate = useMemo(
    () =>
      checkins.reduce<Record<string, Checkin[]>>((acc, c) => {
        ;(acc[c.date] ??= []).push(c)
        return acc
      }, {}),
    [checkins]
  )

  // Percentage of active habits marked Completed today (0–100)
  const todayProgress = useMemo(() => {
    const activeHabits = habits.filter((h) => h.status === 'Active')
    if (activeHabits.length === 0) return 0
    const completedCount = todayCheckins.filter((c) => c.status === 'Completed').length
    return Math.round((completedCount / activeHabits.length) * 100)
  }, [habits, todayCheckins])

  function getCheckinByHabitAndDate(habitId: number, date: string): Checkin | undefined {
    return checkins.find((c) => c.habitId === habitId && c.date === date)
  }

  function upsertCheckin(
    habitId: number,
    date: string,
    updates: Partial<Omit<Checkin, 'id' | 'habitId' | 'date'>>
  ) {
    const existing = getCheckinByHabitAndDate(habitId, date)
    if (existing) {
      updateCheckin(existing.id, updates)
    } else {
      addCheckin({ habitId, date, completedCount: 0, status: 'Not Started', ...updates })
    }
  }

  function markComplete(habitId: number, date: string) {
    const habit = habits.find((h) => h.id === habitId)
    if (!habit) return
    upsertCheckin(habitId, date, {
      completedCount: habit.targetPerDay,
      status: 'Completed',
    })
  }

  function incrementCount(habitId: number, date: string) {
    const habit = habits.find((h) => h.id === habitId)
    if (!habit) return
    const existing = getCheckinByHabitAndDate(habitId, date)
    const newCount = Math.min((existing?.completedCount ?? 0) + 1, habit.targetPerDay)
    upsertCheckin(habitId, date, {
      completedCount: newCount,
      status: computeStatus(newCount, habit.targetPerDay),
    })
  }

  function decrementCount(habitId: number, date: string) {
    const habit = habits.find((h) => h.id === habitId)
    if (!habit) return
    const existing = getCheckinByHabitAndDate(habitId, date)
    const newCount = Math.max((existing?.completedCount ?? 0) - 1, 0)
    upsertCheckin(habitId, date, {
      completedCount: newCount,
      status: computeStatus(newCount, habit.targetPerDay),
    })
  }

  return {
    checkins,
    todayCheckins,
    checkinsByDate,
    todayProgress,
    getCheckinByHabitAndDate,
    upsertCheckin,
    markComplete,
    incrementCount,
    decrementCount,
    deleteCheckin,
  }
}
