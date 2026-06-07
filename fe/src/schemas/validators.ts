import { z } from 'zod'
import { AppError } from '@/domain/AppError'
import { ERR } from '@/domain/errorCodes'
import { isFutureDate } from '@/utils/dateUtils'

// ─── Habit ───────────────────────────────────────────────────────────────────

export const HabitInputSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(60, 'Name must be 60 characters or fewer'),
    category: z.enum(['HEALTH', 'STUDY', 'WORK', 'MINDFULNESS', 'OTHER']),
    frequencyType: z.enum(['DAILY', 'SPECIFIC_DAYS']),
    daysOfWeek: z.array(
      z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'])
    ),
    targetPerDay: z
      .number({ invalid_type_error: 'Target must be a number' })
      .int()
      .min(1, 'Target must be at least 1'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  })
  .superRefine((data, ctx) => {
    if (data.frequencyType === 'SPECIFIC_DAYS' && data.daysOfWeek.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Choose at least one day',
        path: ['daysOfWeek'],
      })
    }
  })

export type HabitInputData = z.infer<typeof HabitInputSchema>

// ─── CheckIn ─────────────────────────────────────────────────────────────────

export const CheckInInputSchema = z.object({
  habitId: z.string().min(1),
  date: z.string().min(1),
  completedCount: z
    .number({ invalid_type_error: 'Count must be a number' })
    .int()
    .min(0, 'Count cannot be negative'),
  note: z.string().max(200, 'Note must be 200 characters or fewer').nullable().optional(),
})

// ─── Goal ─────────────────────────────────────────────────────────────────────

export const GoalInputSchema = z.object({
  targetType: z.enum(['STREAK', 'TOTAL_COMPLETIONS']),
  targetValue: z
    .number({ invalid_type_error: 'Target value must be a number' })
    .int()
    .min(1, 'Target value must be at least 1'),
})

export type GoalInputData = z.infer<typeof GoalInputSchema>

// ─── Cross-field validators ───────────────────────────────────────────────────

export function notFutureDate(dateStr: string): boolean {
  return !isFutureDate(dateStr)
}

export function countWithinTarget(count: number, target: number): boolean {
  return count >= 0 && count <= target
}

// ─── ZodError → AppError mapper ───────────────────────────────────────────────

export function zodToAppError(err: z.ZodError): AppError {
  const first = err.errors[0]
  if (!first) return new AppError(ERR.HABIT.NAME_REQUIRED, 'Validation failed')
  const field = first.path.join('.')
  const code = fieldToErrorCode(field)
  return new AppError(code, first.message, field)
}

function fieldToErrorCode(field: string): string {
  if (field === 'name') return ERR.HABIT.NAME_REQUIRED
  if (field === 'targetPerDay') return ERR.HABIT.TARGET_INVALID
  if (field === 'daysOfWeek') return ERR.HABIT.DAYS_REQUIRED
  if (field === 'targetValue') return ERR.GOAL.TARGET_INVALID
  return 'ERR.VALIDATION'
}
