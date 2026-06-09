import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  currentStreak,
  longestStreak,
  totalCompletions,
  weeklyCompletionRate,
  isAtRisk,
  goalProgress,
  subDays,
} from '@/features/dashboard/services'
import type { Habit, Checkin, Goal } from '@/types'

// All tests run with today fixed to 2026-06-09 (Tuesday) so results are deterministic.
const FAKE_TODAY = '2026-06-09'

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: 1,
    name: 'Test',
    category: 'Health',
    frequency: 'Daily',
    specificDays: null,
    targetPerDay: 1,
    priority: 'Medium',
    status: 'Active',
    createdAt: '2026-01-01',
    ...overrides,
  }
}

function checkin(habitId: number, daysBack: number): Checkin {
  return {
    id: habitId * 100 + daysBack,
    habitId,
    date: subDays(FAKE_TODAY, daysBack),
    completedCount: 1,
    status: 'Completed',
  }
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(FAKE_TODAY + 'T12:00:00'))
})

afterEach(() => {
  vi.useRealTimers()
})

// ---------------------------------------------------------------------------
// currentStreak
// ---------------------------------------------------------------------------

describe('currentStreak', () => {
  it('returns 0 when there are no check-ins', () => {
    const habit = makeHabit()
    expect(currentStreak(habit, [])).toBe(0)
  })

  it('returns 1 when only today is completed', () => {
    const habit = makeHabit()
    expect(currentStreak(habit, [checkin(1, 0)])).toBe(1)
  })

  it('returns 3 for three consecutive completed days ending today', () => {
    const habit = makeHabit()
    const checkins: Checkin[] = [checkin(1, 0), checkin(1, 1), checkin(1, 2)]
    expect(currentStreak(habit, checkins)).toBe(3)
  })

  it('returns 0 when today is not completed (streak not started yet today)', () => {
    const habit = makeHabit()
    // Only yesterday and the day before completed — today is missing
    const checkins: Checkin[] = [checkin(1, 1), checkin(1, 2)]
    expect(currentStreak(habit, checkins)).toBe(0)
  })

  it('stops at the first unscheduled-but-missed day for specific-days habits', () => {
    // Habit scheduled Mon, Wed, Fri (days 1, 3, 5)
    // Today = Tue Jun 9 (unscheduled) → walk back to Mon Jun 8 (scheduled, completed), Fri Jun 5 (scheduled, completed), Wed Jun 3 (scheduled, completed)
    const habit = makeHabit({ frequency: 'Specific', specificDays: [1, 3, 5] })
    const checkins: Checkin[] = [
      checkin(1, 1), // Mon Jun 8 — completed
      checkin(1, 4), // Fri Jun 5 — completed
      checkin(1, 6), // Wed Jun 3 — completed
    ]
    expect(currentStreak(habit, checkins)).toBe(3)
  })

  it('does not count days before createdAt', () => {
    const habit = makeHabit({ createdAt: subDays(FAKE_TODAY, 1) }) // created yesterday
    // Complete both yesterday and today — streak should be 2 (not more)
    const checkins: Checkin[] = [checkin(1, 0), checkin(1, 1)]
    expect(currentStreak(habit, checkins)).toBe(2)
  })
})

// ---------------------------------------------------------------------------
// longestStreak
// ---------------------------------------------------------------------------

describe('longestStreak', () => {
  it('returns 0 with no check-ins', () => {
    expect(longestStreak(makeHabit(), [])).toBe(0)
  })

  it('returns the length of a continuous run', () => {
    const habit = makeHabit()
    const checkins: Checkin[] = [
      checkin(1, 4),
      checkin(1, 3),
      checkin(1, 2),
      checkin(1, 1),
      checkin(1, 0),
    ]
    expect(longestStreak(habit, checkins)).toBe(5)
  })

  it('returns the longer of two separate runs', () => {
    const habit = makeHabit()
    // days 8,7,6 completed (3-day run), gap on 5, days 4,3,2,1,0 completed (5-day run)
    const checkins: Checkin[] = [
      checkin(1, 8),
      checkin(1, 7),
      checkin(1, 6),
      checkin(1, 4),
      checkin(1, 3),
      checkin(1, 2),
      checkin(1, 1),
      checkin(1, 0),
    ]
    expect(longestStreak(habit, checkins)).toBe(5)
  })
})

// ---------------------------------------------------------------------------
// totalCompletions
// ---------------------------------------------------------------------------

describe('totalCompletions', () => {
  it('returns 0 with no check-ins', () => {
    expect(totalCompletions(makeHabit(), [])).toBe(0)
  })

  it('counts only Completed status', () => {
    const habit = makeHabit()
    const checkins: Checkin[] = [
      checkin(1, 0),
      checkin(1, 1),
      {
        id: 999,
        habitId: 1,
        date: subDays(FAKE_TODAY, 2),
        completedCount: 0,
        status: 'Not Started',
      },
    ]
    expect(totalCompletions(habit, checkins)).toBe(2)
  })

  it('ignores check-ins belonging to another habit', () => {
    const habit = makeHabit({ id: 1 })
    const checkins: Checkin[] = [checkin(2, 0), checkin(2, 1)] // habitId 2
    expect(totalCompletions(habit, checkins)).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// weeklyCompletionRate
// ---------------------------------------------------------------------------

describe('weeklyCompletionRate', () => {
  it('returns 0 when no check-ins in last 7 days', () => {
    expect(weeklyCompletionRate(makeHabit(), [])).toBe(0)
  })

  it('returns 1 when all 7 days completed (daily habit)', () => {
    const habit = makeHabit()
    const checkins = [0, 1, 2, 3, 4, 5, 6].map((d) => checkin(1, d))
    expect(weeklyCompletionRate(habit, checkins)).toBe(1)
  })

  it('returns 4/7 when 4 of 7 days completed', () => {
    const habit = makeHabit()
    const checkins = [0, 2, 4, 6].map((d) => checkin(1, d))
    expect(weeklyCompletionRate(habit, checkins)).toBeCloseTo(4 / 7)
  })
})

// ---------------------------------------------------------------------------
// isAtRisk
// ---------------------------------------------------------------------------

describe('isAtRisk', () => {
  it('returns true when scheduled today, not done, and has a prior streak', () => {
    const habit = makeHabit()
    // Yesterday completed (streak = 1), today not done yet
    const checkins: Checkin[] = [checkin(1, 1)]
    expect(isAtRisk(habit, checkins)).toBe(true)
  })

  it('returns false when today is already completed', () => {
    const habit = makeHabit()
    const checkins: Checkin[] = [checkin(1, 0), checkin(1, 1)]
    expect(isAtRisk(habit, checkins)).toBe(false)
  })

  it('returns false when there is no prior streak (new habit, nothing done)', () => {
    expect(isAtRisk(makeHabit(), [])).toBe(false)
  })

  it('returns false when the habit is not scheduled today', () => {
    // Today = Tuesday (day 2); habit only on Mon/Wed/Fri (1,3,5)
    const habit = makeHabit({ frequency: 'Specific', specificDays: [1, 3, 5] })
    // Even if Monday was completed, today (Tuesday) is not scheduled → not at risk
    const checkins: Checkin[] = [checkin(1, 1)]
    expect(isAtRisk(habit, checkins)).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// goalProgress
// ---------------------------------------------------------------------------

describe('goalProgress', () => {
  it('returns 80 for a streak goal at 80% boundary', () => {
    const habit = makeHabit()
    const goal: Goal = { id: 1, habitId: 1, targetType: 'Streak', targetValue: 20 }
    // Build 16-day streak ending today
    const checkins = Array.from({ length: 16 }, (_, i) => checkin(1, i))
    expect(goalProgress(goal, habit, checkins)).toBe(80)
  })

  it('returns 100 for a total-completions goal at exactly the target', () => {
    const habit = makeHabit()
    const goal: Goal = { id: 1, habitId: 1, targetType: 'Total', targetValue: 10 }
    const checkins = Array.from({ length: 10 }, (_, i) => checkin(1, i))
    expect(goalProgress(goal, habit, checkins)).toBe(100)
  })

  it('caps at 100 even when completions exceed the target', () => {
    const habit = makeHabit()
    const goal: Goal = { id: 1, habitId: 1, targetType: 'Total', targetValue: 5 }
    const checkins = Array.from({ length: 10 }, (_, i) => checkin(1, i))
    expect(goalProgress(goal, habit, checkins)).toBe(100)
  })
})
