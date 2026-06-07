import { format, parseISO, isAfter, subDays, eachDayOfInterval, getDay, startOfDay } from 'date-fns'
import type { DayOfWeek } from '@/types'

const DAY_INDEX_TO_DOW: DayOfWeek[] = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
]

export function today(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function isFutureDate(dateStr: string): boolean {
  const d = parseISO(dateStr)
  const todayStart = startOfDay(new Date())
  return isAfter(startOfDay(d), todayStart)
}

export function isToday(dateStr: string): boolean {
  return dateStr === today()
}

export function subDaysFromDate(dateStr: string, n: number): string {
  return format(subDays(parseISO(dateStr), n), 'yyyy-MM-dd')
}

export function eachDayBetween(start: string, end: string): string[] {
  return eachDayOfInterval({
    start: parseISO(start),
    end: parseISO(end),
  }).map((d) => format(d, 'yyyy-MM-dd'))
}

export function getDayOfWeek(dateStr: string): DayOfWeek {
  const idx = getDay(parseISO(dateStr))
  return DAY_INDEX_TO_DOW[idx]!
}

export function last7Days(): string[] {
  const t = today()
  return eachDayBetween(subDaysFromDate(t, 6), t)
}
