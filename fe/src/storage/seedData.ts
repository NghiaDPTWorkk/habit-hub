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
  return d.toLocaleDateString('en-CA')
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

function makeCheckin(habitId: number, daysBack: number, count: number): Checkin {
  return {
    habitId,
    date: daysAgo(daysBack),
    completedCount: count,
    status: count > 0 ? 'Completed' : 'Not Started',
  }
}

// 21 days of check-ins across all habits for a realistic demo state.
export const SEED_CHECKINS: Checkin[] = [
  // Morning Exercise (H1) — daily, completed most days
  ...Array.from({ length: 20 }, (_, i) => makeCheckin(H1, i + 1, 1)),

  // Read 20 Pages (H2) — daily, a few missed days for realism
  ...([1, 2, 3, 5, 6, 8, 9, 10, 12, 13, 14, 15, 17, 18] as number[]).map((d) =>
    makeCheckin(H2, d, 1)
  ),

  // Meditate (H3) — specific days (Mon/Wed/Fri), good streak
  ...([2, 4, 7, 9, 11, 14, 16] as number[]).map((d) => makeCheckin(H3, d, 1)),

  // Drink Water (H4) — daily, partial progress some days
  makeCheckin(H4, 1, 8),
  makeCheckin(H4, 2, 8),
  makeCheckin(H4, 3, 5),
  makeCheckin(H4, 4, 8),
  makeCheckin(H4, 5, 8),
  makeCheckin(H4, 6, 3),
  makeCheckin(H4, 7, 8),
  makeCheckin(H4, 8, 8),
  makeCheckin(H4, 9, 8),
  makeCheckin(H4, 10, 6),
  makeCheckin(H4, 11, 8),
  makeCheckin(H4, 12, 8),
  makeCheckin(H4, 13, 8),
  makeCheckin(H4, 14, 8),

  // Work Journal (H5) — specific days (Mon/Wed/Fri), newer habit
  ...([3, 7, 10, 14, 17] as number[]).map((d) => makeCheckin(H5, d, 1)),
]

export const SEED_GOALS: Goal[] = [
  {
    id: 'goal-3001',
    habitId: H1,
    targetType: 'streak',
    targetValue: 21,
    status: 'active',
    createdAt: daysAgo(30),
  },
]
