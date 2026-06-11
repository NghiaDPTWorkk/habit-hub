import { useMemo } from 'react'
import { useBoundStore } from '@/store'
import type { DashboardDto } from '@/types'
import type { HeatmapDay } from '@/components/ui/CalendarHeatmap'
import type { MiniChartItem } from '@/components/ui/MiniChart'
import { getDashboard, getDailyIntensity, getWeeklyCategoryRates } from '../services'

export function useDashboard(): DashboardDto {
  const habits = useBoundStore((s) => s.habits)
  const checkins = useBoundStore((s) => s.checkins)
  const goals = useBoundStore((s) => s.goals)
  return useMemo(() => getDashboard(habits, checkins, goals), [habits, checkins, goals])
}

export function useDailyIntensity(days = 365): HeatmapDay[] {
  const checkins = useBoundStore((s) => s.checkins)
  return useMemo(() => getDailyIntensity(days, checkins), [days, checkins])
}

export function useWeeklyRates(): MiniChartItem[] {
  const habits = useBoundStore((s) => s.habits)
  const checkins = useBoundStore((s) => s.checkins)
  return useMemo(() => getWeeklyCategoryRates(habits, checkins), [habits, checkins])
}
