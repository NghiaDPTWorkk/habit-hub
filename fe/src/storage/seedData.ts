import type { Habit, Checkin, Goal } from '@/types'

// Fixed seed IDs — not generated at runtime so the demo state is always deterministic.
const H1 = 1001
const H2 = 1002
const H3 = 1003
const H4 = 1004
const H5 = 1005
const H6 = 1006
const H7 = 1007

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toLocaleDateString('en-CA')
}

function getWeekdayOfDaysAgo(n: number): number {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.getDay()
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
    createdAt: daysAgo(28),
  },
  {
    id: H2,
    name: 'Read Books',
    category: 'Study',
    frequency: 'Daily',
    specificDays: null,
    targetPerDay: 1,
    priority: 'Medium',
    status: 'Active',
    createdAt: daysAgo(28),
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
    createdAt: daysAgo(28),
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
    createdAt: daysAgo(28),
  },
  {
    id: H5,
    name: 'Work Journal',
    category: 'Work',
    frequency: 'Specific',
    specificDays: [2, 4], // Tue, Thu
    targetPerDay: 1,
    priority: 'Low',
    status: 'Active',
    createdAt: daysAgo(28),
  },
  {
    id: H6,
    name: 'Coding Practice',
    category: 'Study',
    frequency: 'Daily',
    specificDays: null,
    targetPerDay: 1,
    priority: 'High',
    status: 'Active',
    createdAt: daysAgo(14), // Newer habit
  },
  {
    id: H7,
    name: 'Limit Social Media',
    category: 'Mindfulness',
    frequency: 'Daily',
    specificDays: null,
    targetPerDay: 1,
    priority: 'Low',
    status: 'Active',
    createdAt: daysAgo(28),
  },
]

function makeCheckin(habitId: number, daysBack: number, count: number, target: number): Checkin {
  let status: Checkin['status'] = 'Not Started'
  if (count >= target) {
    status = 'Completed'
  } else if (count > 0) {
    status = 'In Progress'
  }
  return {
    habitId,
    date: daysAgo(daysBack),
    completedCount: count,
    status,
  }
}

// Dynamically generate diverse check-ins spanning exactly 4 weeks (28 days)
const generatedCheckins: Checkin[] = []

for (let d = 0; d <= 28; d++) {
  const dayOfWeek = getWeekdayOfDaysAgo(d)

  // H1: Morning Exercise (Daily, Target 1). Completed most days, miss days 3, 10, 17
  if (d !== 3 && d !== 10 && d !== 17) {
    generatedCheckins.push(makeCheckin(H1, d, 1, 1))
  } else {
    generatedCheckins.push(makeCheckin(H1, d, 0, 1))
  }

  // H2: Read Books (Daily, Target 1). Completed moderately
  if (d % 3 !== 0) {
    generatedCheckins.push(makeCheckin(H2, d, 1, 1))
  } else {
    generatedCheckins.push(makeCheckin(H2, d, 0, 1))
  }

  // H3: Meditate (Specific Mon, Wed, Fri [1, 3, 5], Target 1).
  if ([1, 3, 5].includes(dayOfWeek)) {
    // Complete 80% of them
    if (d % 5 !== 0) {
      generatedCheckins.push(makeCheckin(H3, d, 1, 1))
    } else {
      generatedCheckins.push(makeCheckin(H3, d, 0, 1))
    }
  }

  // H4: Drink 8 Glasses of Water (Daily, Target 8). Multi-step habit progress.
  if (d === 8) {
    generatedCheckins.push(makeCheckin(H4, d, 4, 8)) // In Progress
  } else if (d === 15) {
    generatedCheckins.push(makeCheckin(H4, d, 6, 8)) // In Progress
  } else if (d === 22) {
    generatedCheckins.push(makeCheckin(H4, d, 0, 8)) // Not Started
  } else {
    generatedCheckins.push(makeCheckin(H4, d, 8, 8)) // Completed
  }

  // H5: Work Journal (Specific Tue, Thu [2, 4], Target 1). Neglected habit.
  if ([2, 4].includes(dayOfWeek)) {
    if (d > 20) {
      generatedCheckins.push(makeCheckin(H5, d, 1, 1)) // Completed early on only
    } else {
      generatedCheckins.push(makeCheckin(H5, d, 0, 1))
    }
  }

  // H6: Coding Practice (Daily, Target 1). New habit (14 days ago).
  if (d <= 14) {
    generatedCheckins.push(makeCheckin(H6, d, 1, 1)) // Perfect streak for the last 2 weeks
  }

  // H7: Limit Social Media (Daily, Target 1). Intermittent.
  if (d % 2 === 0) {
    generatedCheckins.push(makeCheckin(H7, d, 1, 1))
  } else {
    generatedCheckins.push(makeCheckin(H7, d, 0, 1))
  }
}

export const SEED_CHECKINS: Checkin[] = generatedCheckins

export const SEED_GOALS: Goal[] = [
  {
    id: 'goal-4001',
    habitId: H6, // Coding Practice
    targetType: 'streak',
    targetValue: 10, // Completed (streak is 14)
    status: 'completed',
    createdAt: daysAgo(14),
  },
  {
    id: 'goal-4002',
    habitId: H1, // Morning Exercise
    targetType: 'total_completions',
    targetValue: 200, // Gray/uncompleted (current completions ~25)
    status: 'active',
    createdAt: daysAgo(28),
  },
  {
    id: 'goal-4003',
    habitId: H4, // Drink Water
    targetType: 'total_completions',
    targetValue: 200, // Gray/uncompleted (current completions ~26)
    status: 'active',
    createdAt: daysAgo(28),
  },
  {
    id: 'goal-4004',
    habitId: H2, // Read Books
    targetType: 'total_completions',
    targetValue: 20, // At 90% (milestone case!)
    status: 'active',
    createdAt: daysAgo(28),
  },
  {
    id: 'goal-4005',
    habitId: H1, // Morning Exercise
    targetType: 'total_completions',
    targetValue: 15, // Completed
    status: 'completed',
    createdAt: daysAgo(28),
  },
  {
    id: 'goal-4006',
    habitId: H3, // Meditate
    targetType: 'streak',
    targetValue: 8, // Active streak
    status: 'active',
    createdAt: daysAgo(28),
  },
]
