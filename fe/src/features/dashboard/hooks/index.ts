import { useMemo } from 'react'
import { useBoundStore } from '@/store'
import type { DashboardDto } from '@/types'
import type { HeatmapDay } from '@/components/ui/CalendarHeatmap'
import type { MiniChartItem } from '@/components/ui/MiniChart'
import {
  getDashboard,
  getDailyIntensity,
  getWeeklyCategoryRates,
  getWeeklyCategoryStats,
} from '../services'

export function useDashboard(): DashboardDto {
  const habits = useBoundStore((s) => s.habits)
  const checkins = useBoundStore((s) => s.checkins)
  const goals = useBoundStore((s) => s.goals)
  return useMemo(
    () => getDashboard(habits, Object.values(checkins), goals),
    [habits, checkins, goals]
  )
}

export function useDailyIntensity(days = 365): HeatmapDay[] {
  const checkins = useBoundStore((s) => s.checkins)
  return useMemo(() => getDailyIntensity(days, Object.values(checkins)), [days, checkins])
}

export function useWeeklyRates(): MiniChartItem[] {
  const habits = useBoundStore((s) => s.habits)
  const checkins = useBoundStore((s) => s.checkins)
  return useMemo(() => getWeeklyCategoryRates(habits, Object.values(checkins)), [habits, checkins])
}

export function useWeeklyCategoryStats(): { name: string; value: number; percentage: number }[] {
  const habits = useBoundStore((s) => s.habits)
  const checkins = useBoundStore((s) => s.checkins)
  return useMemo(() => getWeeklyCategoryStats(habits, Object.values(checkins)), [habits, checkins])
}
