import { describe, it, expect } from 'vitest'
import {
  isScheduledForDate,
  getScheduledDatesInRange,
  isScheduledToday,
  getScheduledDaysOfWeek,
} from './ScheduleService'
import type { Habit } from '@/types'

const createMockHabit = (overrides: Partial<Habit>): Habit => ({
  id: 1,
  name: 'Mock Habit',
  category: 'Health',
  frequency: 'Daily',
  specificDays: null,
  targetPerDay: 1,
  priority: 'Medium',
  status: 'Active',
  createdAt: '2026-06-01',
  ...overrides,
})

describe('ScheduleService', () => {
  describe('isScheduledForDate', () => {
    it('should return false if habit is Archived', () => {
      const habit = createMockHabit({ status: 'Archived' })
      expect(isScheduledForDate(habit, '2026-06-11')).toBe(false)
    })

    it('should return false if habit is Paused', () => {
      const habit = createMockHabit({ status: 'Paused' })
      expect(isScheduledForDate(habit, '2026-06-11')).toBe(false)
    })

    it('should return true for Daily habits', () => {
      const habit = createMockHabit({ frequency: 'Daily' })
      expect(isScheduledForDate(habit, '2026-06-11')).toBe(true)
    })

    it('should return true for Specific habits on matched days', () => {
      const habit = createMockHabit({
        frequency: 'Specific',
        specificDays: [1, 4], // Monday, Thursday
      })
      // 2026-06-11 is Thursday (getDay() => 4)
      expect(isScheduledForDate(habit, '2026-06-11')).toBe(true)
    })

    it('should return false for Specific habits on unmatched days', () => {
      const habit = createMockHabit({
        frequency: 'Specific',
        specificDays: [1], // Monday only
      })
      // 2026-06-11 is Thursday (getDay() => 4)
      expect(isScheduledForDate(habit, '2026-06-11')).toBe(false)
    })
  })

  describe('getScheduledDatesInRange', () => {
    it('should return correct dates in range for daily habits', () => {
      const habit = createMockHabit({ frequency: 'Daily' })
      const range = getScheduledDatesInRange(habit, '2026-06-08', '2026-06-10')
      expect(range).toEqual(['2026-06-08', '2026-06-09', '2026-06-10'])
    })

    it('should return correct dates in range for specific habits', () => {
      const habit = createMockHabit({
        frequency: 'Specific',
        specificDays: [1, 3], // Monday (8th), Wednesday (10th)
      })
      const range = getScheduledDatesInRange(habit, '2026-06-08', '2026-06-11')
      expect(range).toEqual(['2026-06-08', '2026-06-10'])
    })
  })

  describe('isScheduledToday', () => {
    it('should return boolean for scheduled status today', () => {
      const habit = createMockHabit({ frequency: 'Daily' })
      expect(typeof isScheduledToday(habit)).toBe('boolean')
    })
  })

  describe('getScheduledDaysOfWeek', () => {
    it('should return all 7 days for Daily habits', () => {
      const habit = createMockHabit({ frequency: 'Daily' })
      expect(getScheduledDaysOfWeek(habit)).toEqual([0, 1, 2, 3, 4, 5, 6])
    })

    it('should return specific days for Specific habits', () => {
      const habit = createMockHabit({ frequency: 'Specific', specificDays: [2, 5] })
      expect(getScheduledDaysOfWeek(habit)).toEqual([2, 5])
    })

    it('should return empty array if specificDays is null', () => {
      const habit = createMockHabit({ frequency: 'Specific', specificDays: null })
      expect(getScheduledDaysOfWeek(habit)).toEqual([])
    })
  })
})
