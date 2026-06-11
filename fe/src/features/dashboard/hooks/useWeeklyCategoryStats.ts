import { useMemo } from 'react'
import dayjs from 'dayjs'
import { useBoundStore } from '@/store'
import { useCheckinStore } from '@/features/checkins/hooks'
import { makeCheckinKey } from '@/store/checkinSlice'

export interface CategoryStat {
  name: string
  value: number
  percentage: number
}

const DAYS_IN_WEEK = 7
const STATUS_ACTIVE = 'Active'
const STATUS_COMPLETED = 'Completed'

export function useWeeklyCategoryStats(): CategoryStat[] {
  const habits = useBoundStore((state) => state.habits)
  const { checkins } = useCheckinStore()

  return useMemo(() => {
    const today = dayjs()
    const activeHabits = habits.filter((h) => h.status === STATUS_ACTIVE)
    const totals: Record<string, number> = {}

    for (let i = 0; i < DAYS_IN_WEEK; i++) {
      const date = today.subtract(i, 'day').format('YYYY-MM-DD')
      for (const habit of activeHabits) {
        const checkin = checkins[makeCheckinKey(habit.id, date)]
        if (checkin?.status === STATUS_COMPLETED) {
          totals[habit.category] = (totals[habit.category] ?? 0) + 1
        }
      }
    }

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
