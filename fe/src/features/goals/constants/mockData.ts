import type { Habit, Goal, Checkin } from '@/types'

const today = new Date('2026-06-08')
const yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)
const dayBefore = new Date(today)
dayBefore.setDate(dayBefore.getDate() - 2)
const fourDaysAgo = new Date(today)
fourDaysAgo.setDate(fourDaysAgo.getDate() - 4)

const formatDate = (date: Date): string => date.toISOString().split('T')[0]

export const MOCK_HABITS: Habit[] = [
  {
    id: 1,
    name: 'Uống nước',
    description: 'Uống 8 cốc nước mỗi ngày',
    frequency: 'daily',
    createdAt: '2026-05-01',
  },
  {
    id: 2,
    name: 'Tập thể dục',
    description: 'Tập luyện 30 phút mỗi ngày',
    frequency: 'daily',
    createdAt: '2026-05-01',
  },
  {
    id: 3,
    name: 'Đọc sách',
    description: 'Đọc sách 20 phút mỗi ngày',
    frequency: 'daily',
    createdAt: '2026-05-05',
  },
]

export const MOCK_GOALS: Goal[] = [
  {
    id: 'goal-1',
    habitId: '1',
    targetType: 'streak',
    targetValue: 30,
    status: 'active',
    createdAt: '2026-05-10',
  },
  {
    id: 'goal-2',
    habitId: '2',
    targetType: 'total_completions',
    targetValue: 50,
    status: 'active',
    createdAt: '2026-05-10',
  },
]

export const MOCK_CHECKINS: Checkin[] = [
  // Habit 1: 3 ngày liên tiếp (streak test)
  {
    id: 1,
    habitId: 1,
    date: formatDate(today),
    completedCount: 1,
    status: 'Completed',
  },
  {
    id: 2,
    habitId: 1,
    date: formatDate(yesterday),
    completedCount: 1,
    status: 'Completed',
  },
  {
    id: 3,
    habitId: 1,
    date: formatDate(dayBefore),
    completedCount: 1,
    status: 'Completed',
  },
  // Habit 2: 10+ checkins (total_completions test)
  {
    id: 4,
    habitId: 2,
    date: formatDate(today),
    completedCount: 1,
    status: 'Completed',
  },
  {
    id: 5,
    habitId: 2,
    date: formatDate(yesterday),
    completedCount: 1,
    status: 'Completed',
  },
  {
    id: 6,
    habitId: 2,
    date: formatDate(dayBefore),
    completedCount: 1,
    status: 'Completed',
  },
  {
    id: 7,
    habitId: 2,
    date: formatDate(fourDaysAgo),
    completedCount: 1,
    status: 'Completed',
  },
  {
    id: 8,
    habitId: 2,
    date: '2026-06-03',
    completedCount: 1,
    status: 'Completed',
  },
  {
    id: 9,
    habitId: 2,
    date: '2026-06-02',
    completedCount: 1,
    status: 'Completed',
  },
  {
    id: 10,
    habitId: 2,
    date: '2026-06-01',
    completedCount: 1,
    status: 'Completed',
  },
  {
    id: 11,
    habitId: 2,
    date: '2026-05-31',
    completedCount: 1,
    status: 'Completed',
  },
  {
    id: 12,
    habitId: 2,
    date: '2026-05-30',
    completedCount: 1,
    status: 'Completed',
  },
  {
    id: 13,
    habitId: 2,
    date: '2026-05-29',
    completedCount: 1,
    status: 'Completed',
  },
]
