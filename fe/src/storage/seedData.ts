import type { Habit, Checkin, Goal } from '@/types'

// Fixed seed IDs — not generated at runtime so the demo state is always deterministic.
const H1 = 1001
const H2 = 1002
const H3 = 1003
const H4 = 1004
const H5 = 1005

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

export const SEED_HABITS: Habit[] = [
  {
    id: H1,
    name: 'Morning Exercise',
    category: 'Health',
    frequency: 'Daily',
    specificDays: null,
    targetPerDay: 1,
    priority: 'High',
    status: 'Active',
    createdAt: daysAgo(30),
  },
  {
    id: H2,
    name: 'Read 20 Pages',
    category: 'Study',
    frequency: 'Daily',
    specificDays: null,
    targetPerDay: 1,
    priority: 'Medium',
    status: 'Active',
    createdAt: daysAgo(30),
  },
  {
    id: H3,
    name: 'Meditate',
    category: 'Mindfulness',
    frequency: 'Specific',
    specificDays: [1, 3, 5], // Mon, Wed, Fri
    targetPerDay: 1,
    priority: 'Medium',
    status: 'Active',
    createdAt: daysAgo(30),
  },
  {
    id: H4,
    name: 'Drink 8 Glasses of Water',
    category: 'Health',
    frequency: 'Daily',
    specificDays: null,
    targetPerDay: 8,
    priority: 'High',
    status: 'Active',
    createdAt: daysAgo(30),
  },
  {
    id: H5,
    name: 'Work Journal',
    category: 'Work',
    frequency: 'Specific',
    specificDays: [1, 3, 5], // Mon, Wed, Fri
    targetPerDay: 1,
    priority: 'Low',
    status: 'Active',
    createdAt: daysAgo(30),
  },
]

function makeCheckin(id: number, habitId: number, daysBack: number, count: number): Checkin {
  return {
    id,
    habitId,
    date: daysAgo(daysBack),
    completedCount: count,
    status: count > 0 ? 'Completed' : 'Not Started',
  }
}

// 21 days of check-ins across all habits for a realistic demo state.
export const SEED_CHECKINS: Checkin[] = [
  // Morning Exercise (H1) — daily, completed most days
  ...Array.from({ length: 20 }, (_, i) => makeCheckin(2000 + i, H1, i + 1, 1)),

  // Read 20 Pages (H2) — daily, a few missed days for realism
  ...([1, 2, 3, 5, 6, 8, 9, 10, 12, 13, 14, 15, 17, 18] as number[]).map((d, i) =>
    makeCheckin(2100 + i, H2, d, 1)
  ),

  // Meditate (H3) — specific days (Mon/Wed/Fri), good streak
  ...([2, 4, 7, 9, 11, 14, 16] as number[]).map((d, i) => makeCheckin(2200 + i, H3, d, 1)),

  // Drink Water (H4) — daily, partial progress some days
  makeCheckin(2300, H4, 1, 8),
  makeCheckin(2301, H4, 2, 8),
  makeCheckin(2302, H4, 3, 5),
  makeCheckin(2303, H4, 4, 8),
  makeCheckin(2304, H4, 5, 8),
  makeCheckin(2305, H4, 6, 3),
  makeCheckin(2306, H4, 7, 8),
  makeCheckin(2307, H4, 8, 8),
  makeCheckin(2308, H4, 9, 8),
  makeCheckin(2309, H4, 10, 6),
  makeCheckin(2310, H4, 11, 8),
  makeCheckin(2311, H4, 12, 8),
  makeCheckin(2312, H4, 13, 8),
  makeCheckin(2313, H4, 14, 8),

  // Work Journal (H5) — specific days (Mon/Wed/Fri), newer habit
  ...([3, 7, 10, 14, 17] as number[]).map((d, i) => makeCheckin(2400 + i, H5, d, 1)),
]

export const SEED_GOALS: Goal[] = [
  {
    id: 3001,
    habitId: H1,
    targetType: 'Streak',
    targetValue: 21,
  },
]
