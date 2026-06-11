import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  todayStr,
  subDays,
  addDays,
  currentStreak,
  longestStreak,
  totalCompletions,
  weeklyCompletionRate,
  isAtRisk,
  goalProgress,
} from './index'
import type { Habit, Checkin, Goal } from '@/types'

const BASE_HABIT: Habit = {
  id: 1,
  name: 'Test Habit',
  category: 'Health',
  frequency: 'Daily',
  specificDays: null,
  targetPerDay: 1,
  priority: 'Medium',
  status: 'Active',
  createdAt: '2026-01-01',
}

function makeCheckin(date: string, status: 'Completed' | 'Not Started' = 'Completed'): Checkin {
  return { habitId: 1, date, completedCount: 1, status }
}

describe('todayStr', () => {
  it('returns a YYYY-MM-DD string', () => {
    expect(todayStr()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('subDays / addDays', () => {
  it('subDays returns the correct past date', () => {
    expect(subDays('2026-06-10', 3)).toBe('2026-06-07')
  })

  it('addDays returns the correct future date', () => {
    expect(addDays('2026-06-07', 3)).toBe('2026-06-10')
  })

  it('subDays and addDays are inverses', () => {
    const date = '2026-03-15'
    expect(addDays(subDays(date, 5), 5)).toBe(date)
  })
})

describe('totalCompletions', () => {
  it('counts completed checkins for the habit', () => {
    const checkins = [
      makeCheckin('2026-06-01'),
      makeCheckin('2026-06-02'),
      makeCheckin('2026-06-03', 'Not Started'),
    ]
    expect(totalCompletions(BASE_HABIT, checkins)).toBe(2)
  })

  it('returns 0 when no completions', () => {
    expect(totalCompletions(BASE_HABIT, [])).toBe(0)
  })
})

describe('currentStreak', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-10T12:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns 0 with no checkins', () => {
    expect(currentStreak(BASE_HABIT, [])).toBe(0)
  })

  it('counts consecutive completed days up to today', () => {
    const checkins = [
      makeCheckin('2026-06-10'),
      makeCheckin('2026-06-09'),
      makeCheckin('2026-06-08'),
    ]
    expect(currentStreak(BASE_HABIT, checkins)).toBe(3)
  })

  it('stops at a missed day', () => {
    const checkins = [
      makeCheckin('2026-06-10'),
      makeCheckin('2026-06-09'),
      // 2026-06-08 missed
      makeCheckin('2026-06-07'),
    ]
    expect(currentStreak(BASE_HABIT, checkins)).toBe(2)
  })
})

describe('longestStreak', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-10T12:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns 0 with no checkins', () => {
    expect(longestStreak(BASE_HABIT, [])).toBe(0)
  })

  it('returns the longest streak across history', () => {
    const checkins = [
      makeCheckin('2026-06-01'),
      makeCheckin('2026-06-02'),
      makeCheckin('2026-06-03'),
      // gap
      makeCheckin('2026-06-08'),
      makeCheckin('2026-06-09'),
    ]
    expect(longestStreak(BASE_HABIT, checkins)).toBe(3)
  })
})

describe('weeklyCompletionRate', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-10T12:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns 0 with no checkins', () => {
    expect(weeklyCompletionRate(BASE_HABIT, [])).toBe(0)
  })

  it('returns 1 when all 7 days are completed', () => {
    const checkins = Array.from({ length: 7 }, (_, i) => makeCheckin(subDays('2026-06-10', i)))
    expect(weeklyCompletionRate(BASE_HABIT, checkins)).toBe(1)
  })

  it('returns correct partial rate', () => {
    const checkins = [
      makeCheckin('2026-06-10'),
      makeCheckin('2026-06-09'),
      makeCheckin('2026-06-08'),
      makeCheckin('2026-06-07'),
    ]
    expect(weeklyCompletionRate(BASE_HABIT, checkins)).toBeCloseTo(4 / 7)
  })
})

describe('isAtRisk', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-10T12:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns false when already completed today', () => {
    const checkins = [makeCheckin('2026-06-10'), makeCheckin('2026-06-09')]
    expect(isAtRisk(BASE_HABIT, checkins)).toBe(false)
  })

  it('returns true when not completed today but has prior streak', () => {
    const checkins = [makeCheckin('2026-06-09')]
    expect(isAtRisk(BASE_HABIT, checkins)).toBe(true)
  })

  it('returns false when no streak to protect', () => {
    expect(isAtRisk(BASE_HABIT, [])).toBe(false)
  })
})

describe('goalProgress', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-10T12:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const streakGoal: Goal = {
    id: 'goal-1',
    habitId: 1,
    targetType: 'streak',
    targetValue: 5,
    status: 'active',
    createdAt: '2026-01-01',
  }

  const completionsGoal: Goal = {
    id: 'goal-2',
    habitId: 1,
    targetType: 'total_completions',
    targetValue: 10,
    status: 'active',
    createdAt: '2026-01-01',
  }

  it('calculates streak goal progress', () => {
    const checkins = Array.from({ length: 5 }, (_, i) => makeCheckin(subDays('2026-06-10', i)))
    expect(goalProgress(streakGoal, BASE_HABIT, checkins)).toBe(100)
  })

  it('calculates total_completions goal progress', () => {
    const checkins = Array.from({ length: 5 }, (_, i) => makeCheckin(subDays('2026-06-10', i)))
    expect(goalProgress(completionsGoal, BASE_HABIT, checkins)).toBe(50)
  })

  it('caps progress at 100', () => {
    const checkins = Array.from({ length: 15 }, (_, i) => makeCheckin(subDays('2026-06-10', i)))
    expect(goalProgress(completionsGoal, BASE_HABIT, checkins)).toBe(100)
  })
})
