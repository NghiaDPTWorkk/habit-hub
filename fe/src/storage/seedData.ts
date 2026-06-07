import type { Habit, CheckIn, Goal } from '@/types'
import { subDaysFromDate, today } from '@/utils/dateUtils'

const T = today()

function d(daysAgo: number): string {
  return subDaysFromDate(T, daysAgo)
}

function uuid(seed: number): string {
  return `seed-${seed.toString().padStart(3, '0')}-0000-0000-000000000000`
}

// ─── Habits ──────────────────────────────────────────────────────────────────

export const SEED_HABITS: Habit[] = [
  {
    id: uuid(1),
    name: 'Morning run',
    category: 'HEALTH',
    frequencyType: 'DAILY',
    daysOfWeek: [],
    targetPerDay: 1,
    priority: 'HIGH',
    status: 'ACTIVE',
    createdAt: d(30),
    updatedAt: d(30),
  },
  {
    id: uuid(2),
    name: 'Drink 8 glasses of water',
    category: 'HEALTH',
    frequencyType: 'DAILY',
    daysOfWeek: [],
    targetPerDay: 8,
    priority: 'MEDIUM',
    status: 'ACTIVE',
    createdAt: d(30),
    updatedAt: d(30),
  },
  {
    id: uuid(3),
    name: 'Read 20 pages',
    category: 'STUDY',
    frequencyType: 'SPECIFIC_DAYS',
    daysOfWeek: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
    targetPerDay: 1,
    priority: 'MEDIUM',
    status: 'ACTIVE',
    createdAt: d(25),
    updatedAt: d(25),
  },
  {
    id: uuid(4),
    name: 'Evening meditation',
    category: 'MINDFULNESS',
    frequencyType: 'DAILY',
    daysOfWeek: [],
    targetPerDay: 1,
    priority: 'HIGH',
    status: 'ACTIVE',
    createdAt: d(20),
    updatedAt: d(20),
  },
  {
    id: uuid(5),
    name: 'Deep work block',
    category: 'WORK',
    frequencyType: 'SPECIFIC_DAYS',
    daysOfWeek: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
    targetPerDay: 1,
    priority: 'HIGH',
    status: 'ACTIVE',
    createdAt: d(14),
    updatedAt: d(14),
  },
  {
    id: uuid(6),
    name: 'Journaling',
    category: 'MINDFULNESS',
    frequencyType: 'SPECIFIC_DAYS',
    daysOfWeek: ['MONDAY', 'WEDNESDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
    targetPerDay: 1,
    priority: 'LOW',
    status: 'ACTIVE',
    createdAt: d(18),
    updatedAt: d(18),
  },
  {
    id: uuid(7),
    name: 'Learn Spanish',
    category: 'STUDY',
    frequencyType: 'DAILY',
    daysOfWeek: [],
    targetPerDay: 1,
    priority: 'LOW',
    status: 'PAUSED',
    createdAt: d(60),
    updatedAt: d(5),
  },
]

// ─── Check-ins ────────────────────────────────────────────────────────────────

function checkin(habitId: string, daysAgo: number, completedCount: number, note?: string): CheckIn {
  const date = d(daysAgo)
  const habit = SEED_HABITS.find((h) => h.id === habitId)!
  let completionStatus: CheckIn['completionStatus'] = 'NOT_STARTED'
  if (completedCount > 0 && completedCount < habit.targetPerDay) completionStatus = 'IN_PROGRESS'
  if (completedCount >= habit.targetPerDay) completionStatus = 'COMPLETED'
  return {
    id: `ci-${habitId}-${daysAgo}`,
    habitId,
    date,
    completedCount,
    note: note ?? null,
    completionStatus,
  }
}

// Morning run: completed 12 of last 14 days (missed days 3 and 8)
const runCheckins: CheckIn[] = [0, 1, 2, 4, 5, 6, 7, 9, 10, 11, 12, 13].map((daysAgo) =>
  checkin(uuid(1), daysAgo, 1)
)

// Water: partially completed various days
const waterCheckins: CheckIn[] = [
  checkin(uuid(2), 0, 5),
  checkin(uuid(2), 1, 8),
  checkin(uuid(2), 2, 7),
  checkin(uuid(2), 3, 8),
  checkin(uuid(2), 4, 6),
  checkin(uuid(2), 5, 8),
  checkin(uuid(2), 6, 8),
  checkin(uuid(2), 7, 5),
  checkin(uuid(2), 8, 8),
  checkin(uuid(2), 9, 8),
  checkin(uuid(2), 10, 4),
  checkin(uuid(2), 11, 8),
  checkin(uuid(2), 12, 8),
  checkin(uuid(2), 13, 8),
]

// Reading: weekdays only, completed most
const readCheckins: CheckIn[] = [1, 2, 3, 4, 5, 8, 9, 10, 11, 12].map((daysAgo) =>
  checkin(uuid(3), daysAgo, 1)
)

// Meditation: completed 17 of 20 days (streak for goal demo — near 80%)
const meditationCheckins: CheckIn[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
].map((daysAgo) => checkin(uuid(4), daysAgo, 1))

// Deep work: weekdays, completed most
const deepWorkCheckins: CheckIn[] = [1, 2, 3, 4, 8, 9, 10, 11].map((daysAgo) =>
  checkin(uuid(5), daysAgo, 1)
)

// Journaling: scheduled days, a few completed
const journalCheckins: CheckIn[] = [2, 5, 7, 9, 12].map((daysAgo) => checkin(uuid(6), daysAgo, 1))

export const SEED_CHECKINS: CheckIn[] = [
  ...runCheckins,
  ...waterCheckins,
  ...readCheckins,
  ...meditationCheckins,
  ...deepWorkCheckins,
  ...journalCheckins,
]

// ─── Goals ────────────────────────────────────────────────────────────────────

// Meditation goal: 21-day streak target, currently at ~17 days (~81% progress)
export const SEED_GOALS: Goal[] = [
  {
    id: 'goal-seed-001',
    habitId: uuid(4),
    targetType: 'STREAK',
    targetValue: 21,
    status: 'ACTIVE',
    progressPercent: 0, // recomputed at runtime
    lastThresholdNotified: 'EIGHTY',
    achievedAt: null,
    createdAt: d(20),
  },
]

// ─── Apply helper ─────────────────────────────────────────────────────────────

export interface SeedStore {
  setHabits: (habits: Habit[]) => void
  setCheckIns: (checkIns: CheckIn[]) => void
  setGoals: (goals: Goal[]) => void
  setSeededAt: (ts: string) => void
}

export function applySeedData(store: SeedStore): void {
  store.setHabits(SEED_HABITS)
  store.setCheckIns(SEED_CHECKINS)
  store.setGoals(SEED_GOALS)
  store.setSeededAt(new Date().toISOString())
}
