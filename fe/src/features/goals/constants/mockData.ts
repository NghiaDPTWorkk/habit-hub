import type { Habit, Goal, Checkin } from '@/types'

const today = new Date()
const yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)
const dayBefore = new Date(today)
dayBefore.setDate(dayBefore.getDate() - 2)
const fourDaysAgo = new Date(today)
fourDaysAgo.setDate(fourDaysAgo.getDate() - 4)
const fiveDaysAgo = new Date(today)
fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5)
const sixDaysAgo = new Date(today)
sixDaysAgo.setDate(sixDaysAgo.getDate() - 6)
const sevenDaysAgo = new Date(today)
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
const eightDaysAgo = new Date(today)
eightDaysAgo.setDate(eightDaysAgo.getDate() - 8)
const nineDaysAgo = new Date(today)
nineDaysAgo.setDate(nineDaysAgo.getDate() - 9)
const tenDaysAgo = new Date(today)
tenDaysAgo.setDate(tenDaysAgo.getDate() - 10)

const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const MOCK_HABITS: Habit[] = [
  {
    id: 1,
    name: 'Drink Water',
    category: 'Health',
    frequency: 'Daily',
    specificDays: null,
    targetPerDay: 8,
    priority: 'Medium',
    status: 'Active',
    createdAt: '2026-05-01',
  },
  {
    id: 2,
    name: 'Exercise',
    category: 'Health',
    frequency: 'Daily',
    specificDays: null,
    targetPerDay: 1,
    priority: 'High',
    status: 'Active',
    createdAt: '2026-05-01',
  },
  {
    id: 3,
    name: 'Read Books',
    category: 'Study',
    frequency: 'Daily',
    specificDays: null,
    targetPerDay: 20,
    priority: 'Medium',
    status: 'Active',
    createdAt: '2026-05-05',
  },
]

export const MOCK_GOALS: Goal[] = [
  {
    id: 'goal-1',
    habitId: 1,
    targetType: 'streak',
    targetValue: 3,
    status: 'active',
    createdAt: '2026-05-10',
  },
  {
    id: 'goal-2',
    habitId: 2,
    targetType: 'total_completions',
    targetValue: 10,
    status: 'active',
    createdAt: '2026-05-10',
  },
]

export const MOCK_CHECKINS: Checkin[] = [
  // Habit 1: 3 consecutive days (streak test)
  { habitId: 1, date: formatDate(today), completedCount: 1, status: 'Completed' },
  { habitId: 1, date: formatDate(yesterday), completedCount: 1, status: 'Completed' },
  { habitId: 1, date: formatDate(dayBefore), completedCount: 1, status: 'Completed' },
  // Habit 2: 10 checkins (total_completions test)
  { habitId: 2, date: formatDate(today), completedCount: 1, status: 'Completed' },
  { habitId: 2, date: formatDate(yesterday), completedCount: 1, status: 'Completed' },
  { habitId: 2, date: formatDate(dayBefore), completedCount: 1, status: 'Completed' },
  { habitId: 2, date: formatDate(fourDaysAgo), completedCount: 1, status: 'Completed' },
  { habitId: 2, date: formatDate(fiveDaysAgo), completedCount: 1, status: 'Completed' },
  { habitId: 2, date: formatDate(sixDaysAgo), completedCount: 1, status: 'Completed' },
  { habitId: 2, date: formatDate(sevenDaysAgo), completedCount: 1, status: 'Completed' },
  { habitId: 2, date: formatDate(eightDaysAgo), completedCount: 1, status: 'Completed' },
  { habitId: 2, date: formatDate(nineDaysAgo), completedCount: 1, status: 'Completed' },
  { habitId: 2, date: formatDate(tenDaysAgo), completedCount: 1, status: 'Completed' },
]
