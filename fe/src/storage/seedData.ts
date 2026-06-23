import type { Habit, Checkin, Goal, Note } from '@/types'

// Fixed seed IDs — not generated at runtime so the demo state is always deterministic.
const H1 = 1001
const H2 = 1002
const H3 = 1003
const H4 = 1004
const H5 = 1005
const H6 = 1006

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

// A simple deterministic pseudo-random helper based on day and habit id
function wasCompleted(habitId: number, daysBack: number, probability: number): boolean {
  const x = Math.sin(habitId * 12.9898 + daysBack * 78.233) * 43758.5453
  const rand = x - Math.floor(x)
  return rand < probability
}

// Fluctuates user motivation dynamically over time for higher seed data realism
function getDynamicProbability(habitId: number, daysBack: number, baseProb: number): number {
  const wave = Math.sin((daysBack + habitId * 3) * ((2 * Math.PI) / 25)) * 0.2
  return Math.max(0.1, Math.min(0.95, baseProb + wave))
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
    createdAt: daysAgo(120),
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
    createdAt: daysAgo(120),
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
    createdAt: daysAgo(120),
  },
  {
    id: H4,
    name: 'Drink 8 Glasses of Water',
    category: 'Health',
    frequency: 'Daily',
    specificDays: null,
    targetPerDay: 8,
    priority: 'High',
    status: 'Active', // Drink Water is now active
    createdAt: daysAgo(120),
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
    createdAt: daysAgo(120),
  },
  {
    id: H6,
    name: 'Coding Practice',
    category: 'Study',
    frequency: 'Daily',
    specificDays: null,
    targetPerDay: 1,
    priority: 'High',
    status: 'Paused', // Coding Practice is now paused
    createdAt: daysAgo(120),
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

// Dynamically generate diverse check-ins spanning exactly 120 days (4 months)
const generatedCheckins: Checkin[] = []

for (let d = 0; d <= 120; d++) {
  const dayOfWeek = getWeekdayOfDaysAgo(d)

  // H1: Morning Exercise (Daily, Target 1). Base 55% completion rate.
  // Force NOT completed today (d === 0) but completed yesterday (d === 1) to trigger at-risk banner.
  let h1Completed = wasCompleted(H1, d, getDynamicProbability(H1, d, 0.55))
  if (d === 0) h1Completed = false
  if (d === 1) h1Completed = true
  generatedCheckins.push(makeCheckin(H1, d, h1Completed ? 1 : 0, 1))

  // H2: Read Books (Daily, Target 1). Base 40% completion rate.
  // Force NOT completed today (d === 0) but completed yesterday (d === 1) to trigger at-risk banner.
  let h2Completed = wasCompleted(H2, d, getDynamicProbability(H2, d, 0.4))
  if (d === 0) h2Completed = false
  if (d === 1) h2Completed = true
  generatedCheckins.push(makeCheckin(H2, d, h2Completed ? 1 : 0, 1))

  // H3: Meditate (Specific Mon, Wed, Fri [1, 3, 5], Target 1). Base 50% completion rate on scheduled days.
  if ([1, 3, 5].includes(dayOfWeek)) {
    const h3Completed = wasCompleted(H3, d, getDynamicProbability(H3, d, 0.5))
    generatedCheckins.push(makeCheckin(H3, d, h3Completed ? 1 : 0, 1))
  }

  // H4: Drink 8 Glasses of Water (Daily, Target 8, Active). Base 60% completion rate.
  // Diverse glass count count: fully completed, partially completed, or not completed.
  let waterCount = 0
  const waterProb = getDynamicProbability(H4, d, 0.6)
  if (d === 0) {
    waterCount = 3 // today is in progress (3 / 8 glasses)
  } else if (wasCompleted(H4, d, waterProb)) {
    const r = Math.sin(H4 * 23.45 + d * 11.22) * 43758.5453
    const randVal = r - Math.floor(r)
    if (randVal < 0.45) waterCount = 8
    else if (randVal < 0.75)
      waterCount = 5 + Math.floor(randVal * 3) // 5 to 7
    else waterCount = 2 + Math.floor(randVal * 3) // 2 to 4
  }
  generatedCheckins.push(makeCheckin(H4, d, waterCount, 8))

  // H5: Work Journal (Specific Tue, Thu [2, 4], Target 1). Base 45% completion rate on scheduled days.
  if ([2, 4].includes(dayOfWeek)) {
    let h5Completed = wasCompleted(H5, d, getDynamicProbability(H5, d, 0.45))
    if (d === 0) h5Completed = true // today is completed
    generatedCheckins.push(makeCheckin(H5, d, h5Completed ? 1 : 0, 1))
  }

  // H6: Coding Practice (Daily, Target 1). Paused (no check-ins in the last 15 days).
  if (d > 15) {
    const h6Completed = wasCompleted(H6, d, getDynamicProbability(H6, d, 0.6))
    generatedCheckins.push(makeCheckin(H6, d, h6Completed ? 1 : 0, 1))
  } else {
    generatedCheckins.push(makeCheckin(H6, d, 0, 1))
  }
}

export const SEED_CHECKINS: Checkin[] = generatedCheckins

export const SEED_GOALS: Goal[] = [
  {
    id: 'goal-4001',
    habitId: H2, // Read Books
    targetType: 'total_completions',
    targetValue: 80,
    status: 'active',
    createdAt: daysAgo(120),
  },
]

export const SEED_NOTES: Note[] = [
  {
    id: 'note-1',
    habitId: H2, // Read Books
    date: daysAgo(10), // A specific day during the last 4 months
    content:
      'Finished reading "Atomic Habits" today! Highly recommend it for setting up good routines.',
    createdAt: daysAgo(10),
  },
]
