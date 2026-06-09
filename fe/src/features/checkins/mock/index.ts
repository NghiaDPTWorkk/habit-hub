import type { CheckinStatus } from '@/types'

export type MockCheckinRecord = {
  id: number
  habitName: string
  category: string
  targetPerDay: number
  completedCount: number
  status: CheckinStatus
}

const MOCK_2026_06_09: MockCheckinRecord[] = [
  {
    id: 1,
    habitName: 'Morning Run',
    category: 'Health',
    targetPerDay: 1,
    completedCount: 1,
    status: 'Completed',
  },
  {
    id: 2,
    habitName: 'Drink Water',
    category: 'Health',
    targetPerDay: 8,
    completedCount: 5,
    status: 'In Progress',
  },
  {
    id: 3,
    habitName: 'Read Books',
    category: 'Study',
    targetPerDay: 1,
    completedCount: 0,
    status: 'Not Started',
  },
  {
    id: 4,
    habitName: 'Meditate',
    category: 'Mindfulness',
    targetPerDay: 1,
    completedCount: 1,
    status: 'Completed',
  },
  {
    id: 5,
    habitName: 'Push-ups',
    category: 'Fitness',
    targetPerDay: 30,
    completedCount: 20,
    status: 'In Progress',
  },
]

const MOCK_2026_06_08: MockCheckinRecord[] = [
  {
    id: 6,
    habitName: 'Morning Run',
    category: 'Health',
    targetPerDay: 1,
    completedCount: 1,
    status: 'Completed',
  },
  {
    id: 7,
    habitName: 'Drink Water',
    category: 'Health',
    targetPerDay: 8,
    completedCount: 8,
    status: 'Completed',
  },
  {
    id: 8,
    habitName: 'Read Books',
    category: 'Study',
    targetPerDay: 1,
    completedCount: 1,
    status: 'Completed',
  },
  {
    id: 9,
    habitName: 'Meditate',
    category: 'Mindfulness',
    targetPerDay: 1,
    completedCount: 0,
    status: 'Not Started',
  },
  {
    id: 10,
    habitName: 'Push-ups',
    category: 'Fitness',
    targetPerDay: 30,
    completedCount: 30,
    status: 'Completed',
  },
]

const MOCK_2026_06_07: MockCheckinRecord[] = [
  {
    id: 11,
    habitName: 'Morning Run',
    category: 'Health',
    targetPerDay: 1,
    completedCount: 0,
    status: 'Not Started',
  },
  {
    id: 12,
    habitName: 'Drink Water',
    category: 'Health',
    targetPerDay: 8,
    completedCount: 3,
    status: 'In Progress',
  },
  {
    id: 13,
    habitName: 'Read Books',
    category: 'Study',
    targetPerDay: 1,
    completedCount: 1,
    status: 'Completed',
  },
  {
    id: 14,
    habitName: 'Meditate',
    category: 'Mindfulness',
    targetPerDay: 1,
    completedCount: 1,
    status: 'Completed',
  },
  {
    id: 15,
    habitName: 'Push-ups',
    category: 'Fitness',
    targetPerDay: 30,
    completedCount: 15,
    status: 'In Progress',
  },
]

const MOCK_2026_06_06: MockCheckinRecord[] = [
  {
    id: 16,
    habitName: 'Morning Run',
    category: 'Health',
    targetPerDay: 1,
    completedCount: 1,
    status: 'Completed',
  },
  {
    id: 17,
    habitName: 'Drink Water',
    category: 'Health',
    targetPerDay: 8,
    completedCount: 6,
    status: 'In Progress',
  },
  {
    id: 18,
    habitName: 'Read Books',
    category: 'Study',
    targetPerDay: 1,
    completedCount: 0,
    status: 'Not Started',
  },
  {
    id: 19,
    habitName: 'Meditate',
    category: 'Mindfulness',
    targetPerDay: 1,
    completedCount: 0,
    status: 'Not Started',
  },
  {
    id: 20,
    habitName: 'Push-ups',
    category: 'Fitness',
    targetPerDay: 30,
    completedCount: 30,
    status: 'Completed',
  },
]

export const MOCK_HISTORY: Record<string, MockCheckinRecord[]> = {
  '2026-06-09': MOCK_2026_06_09,
  '2026-06-08': MOCK_2026_06_08,
  '2026-06-07': MOCK_2026_06_07,
  '2026-06-06': MOCK_2026_06_06,
}
