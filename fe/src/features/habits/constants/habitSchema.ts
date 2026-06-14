import { z } from 'zod'
import { getLocalDateString, subtractDays } from '@/utils'

export const habitFormSchema = z
  .object({
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
      .refine((date) => date <= getLocalDateString(), 'Start date cannot be in the future')
      .refine((date) => date >= subtractDays(2), 'Start date cannot be more than 2 days ago'),
    name: z
      .string()
      .trim()
      .min(1, 'Habit name is required')
      .max(50, 'Name must be 50 characters or less'),
    category: z.enum(['Health', 'Study', 'Work', 'Mindfulness', 'Other'] as const, {
      message: 'Please select a category',
    }),
    frequency: z.enum(['Daily', 'Specific'] as const, {
      message: 'Please select a frequency',
    }),
    specificDays: z.array(z.number().int().min(0).max(6)).nullable().default(null),
    targetPerDay: z
      .number()
      .int()
      .min(1, 'Target must be between 1 and 20')
      .max(20, 'Target must be between 1 and 20'),
    priority: z.enum(['Low', 'Medium', 'High'] as const, {
      message: 'Please select a priority',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.frequency === 'Specific' && (!data.specificDays || data.specificDays.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select at least one day',
        path: ['specificDays'],
      })
    }
  })

export type HabitFormValues = z.infer<typeof habitFormSchema>

export const defaultHabitFormValues: HabitFormValues = {
  startDate: getLocalDateString(),
  name: '',
  category: 'Health',
  frequency: 'Daily',
  specificDays: null,
  targetPerDay: 1,
  priority: 'Medium',
}
