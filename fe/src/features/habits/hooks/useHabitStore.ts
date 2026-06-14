import { useBoundStore } from '@/store'
import type { Habit } from '@/types'
import type { HabitFormValues } from '@/features/habits/constants/habitSchema'

export function useHabitStore() {
  const habits = useBoundStore((s) => s.habits)
  const storeAddHabit = useBoundStore((s) => s.addHabit)
  const storeUpdateHabit = useBoundStore((s) => s.updateHabit)
  const storeDeleteHabit = useBoundStore((s) => s.deleteHabit)

  const activeHabits = habits.filter((h) => h.status === 'Active')

  function getHabitById(id: number): Habit | undefined {
    return habits.find((h) => h.id === id)
  }

  function addHabit(data: HabitFormValues): void {
    const { startDate, ...rest } = data
    storeAddHabit({ ...rest, status: 'Active', createdAt: startDate })
  }

  function updateHabit(id: number, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>): void {
    storeUpdateHabit(id, updates)
  }

  function deleteHabit(id: number): void {
    storeDeleteHabit(id)
  }

  function pauseHabit(id: number): void {
    storeUpdateHabit(id, { status: 'Paused' })
  }

  function resumeHabit(id: number): void {
    storeUpdateHabit(id, { status: 'Active' })
  }

  function archiveHabit(id: number): void {
    storeUpdateHabit(id, { status: 'Archived' })
  }

  return {
    habits,
    activeHabits,
    getHabitById,
    addHabit,
    updateHabit,
    deleteHabit,
    pauseHabit,
    resumeHabit,
    archiveHabit,
  }
}
