import { useMemo } from 'react'
import { useBoundStore } from '@/store'
import type { DashboardDto } from '@/types'
import { getDashboard } from '../services'

export * from './useWeeklyCategoryStats'

export function useDashboard(): DashboardDto {
  const habits = useBoundStore((s) => s.habits)
  const checkins = useBoundStore((s) => s.checkins)
  const goals = useBoundStore((s) => s.goals)
  return useMemo(
    () => getDashboard(habits, Object.values(checkins), goals),
    [habits, checkins, goals]
  )
}
