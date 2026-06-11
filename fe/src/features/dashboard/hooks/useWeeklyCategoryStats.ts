import { useMemo } from 'react'
import dayjs from 'dayjs'
import { useBoundStore } from '@/store'
import { useCheckinStore } from '@/features/checkins/hooks'

export interface CategoryStat {
  name: string
  value: number
  percentage: number
}

const DAYS_IN_WEEK = 7
const STATUS_ACTIVE = 'Active'

export function useWeeklyCategoryStats(): CategoryStat[] {
  const habits = useBoundStore((state) => state.habits)
  const { checkins } = useCheckinStore()

  return useMemo(() => {
    const today = dayjs()
    const startDate = today.subtract(DAYS_IN_WEEK - 1, 'day').format('YYYY-MM-DD')
    const endDate = today.format('YYYY-MM-DD')

    const activeHabits = habits.filter((h) => h.status === STATUS_ACTIVE)
    const activeHabitMap = new Map(activeHabits.map((h) => [h.id, h]))

    const totals: Record<string, number> = {}

    Object.values(checkins).forEach((c) => {
      if (c.date < startDate || c.date > endDate) return
      if (c.status !== 'Completed') return
      const habit = activeHabitMap.get(c.habitId)
      if (!habit) return
      totals[habit.category] = (totals[habit.category] ?? 0) + 1
    })

    const grandTotal = Object.values(totals).reduce((sum, v) => sum + v, 0)
    if (grandTotal === 0) return []

    return Object.entries(totals)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({
        name,
        value,
        percentage: Math.round((value / grandTotal) * 100),
      }))
      .sort((a, b) => b.value - a.value)
  }, [habits, checkins])
}
