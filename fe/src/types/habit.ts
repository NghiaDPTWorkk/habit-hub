export type Category = 'HEALTH' | 'STUDY' | 'WORK' | 'MINDFULNESS' | 'OTHER'
export type FrequencyType = 'DAILY' | 'SPECIFIC_DAYS'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'
export type HabitStatus = 'ACTIVE' | 'PAUSED' | 'ARCHIVED'
export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY'

export interface Habit {
  id: string
  name: string
  category: Category
  frequencyType: FrequencyType
  daysOfWeek: DayOfWeek[] // empty array when DAILY
  targetPerDay: number // >= 1
  priority: Priority
  status: HabitStatus
  createdAt: string // YYYY-MM-DD
  updatedAt: string // YYYY-MM-DD
}

export interface HabitInput {
  name: string
  category: Category
  frequencyType: FrequencyType
  daysOfWeek: DayOfWeek[]
  targetPerDay: number
  priority: Priority
}

export interface HabitFilters {
  category?: Category
  frequencyType?: FrequencyType
  priority?: Priority
  status?: HabitStatus
  atRisk?: boolean
}

export const CATEGORY_LABELS: Record<Category, string> = {
  HEALTH: 'Health',
  STUDY: 'Study',
  WORK: 'Work',
  MINDFULNESS: 'Mindfulness',
  OTHER: 'Other',
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
}

export const STATUS_LABELS: Record<HabitStatus, string> = {
  ACTIVE: 'Active',
  PAUSED: 'Paused',
  ARCHIVED: 'Archived',
}

export const FREQUENCY_LABELS: Record<FrequencyType, string> = {
  DAILY: 'Daily',
  SPECIFIC_DAYS: 'Specific days',
}

export const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY: 'Mon',
  TUESDAY: 'Tue',
  WEDNESDAY: 'Wed',
  THURSDAY: 'Thu',
  FRIDAY: 'Fri',
  SATURDAY: 'Sat',
  SUNDAY: 'Sun',
}
