import type { Habit, Checkin, Goal } from '@/types'
import { toUTCDateString } from '@/utils'

// Fixed seed IDs — not generated at runtime so the demo state is always deterministic.
const H1 = 1001
const H2 = 1002
const H3 = 1003
const H4 = 1004
const H5 = 1005
const H6 = 1006
const H7 = 1007
const H8 = 1008

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return toUTCDateString(d.toLocaleDateString('en-CA'))
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
  {
    id: H6,
    name: 'Morning Cardio and Resistance Training Exercise for Health and Longevity with Extra Text that is Long',
    category: 'Mindfulness',
    frequency: 'Daily',
    specificDays: null,
    targetPerDay: 1,
    priority: 'High',
    status: 'Active',
    createdAt: daysAgo(15),
  },
  {
    id: H7,
    name: 'Drink 12 Glasses of Water',
    category: 'Health',
    frequency: 'Daily',
    specificDays: null,
    targetPerDay: 12,
    priority: 'Medium',
    status: 'Active',
    createdAt: daysAgo(10),
  },
  {
    id: H8,
    name: 'Learn Advanced Rust Programming',
    category: 'Study',
    frequency: 'Specific',
    specificDays: [0, 6],
    targetPerDay: 2,
    priority: 'Low',
    status: 'Paused',
    createdAt: daysAgo(20),
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

  // Long name habit check-ins (H6)
  ...Array.from({ length: 5 }, (_, i) => makeCheckin(H6, i + 1, 1)),

  // High target check-in (H7) — with over-completions (e.g. 15/12)
  makeCheckin(H7, 1, 12),
  makeCheckin(H7, 2, 15), // Yesterday: 15 (125% completed - test UI progress overflow)
  makeCheckin(H7, 3, 6),
  makeCheckin(H7, 4, 12),
  makeCheckin(H7, 5, 0),
  makeCheckin(H7, 6, 12),
  makeCheckin(H7, 7, 12),

  // Paused habit history (H8)
  makeCheckin(H8, 2, 2),
  makeCheckin(H8, 7, 2),
  makeCheckin(H8, 8, 2),
  makeCheckin(H8, 14, 1),
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
  {
    id: 'goal-3002',
    habitId: H7,
    targetType: 'total_completions',
    targetValue: 80,
    status: 'active',
    createdAt: daysAgo(10),
  },
  {
    id: 'goal-3003',
    habitId: H8,
    targetType: 'streak',
    targetValue: 10,
    status: 'paused',
    createdAt: daysAgo(20),
  },
]
