export type Category = 'Health' | 'Study' | 'Work' | 'Mindfulness' | 'Other'
export type Frequency = 'Daily' | 'Specific'
export type Priority = 'Low' | 'Medium' | 'High'
export type HabitStatus = 'Active' | 'Paused' | 'Archived'
export type CheckinStatus = 'Not Started' | 'In Progress' | 'Completed'
export type TargetType = 'Streak' | 'Total'

export interface Habit {
  id: number
  name: string
  category: Category
  frequency: Frequency
  specificDays: number[] | null
  targetPerDay: number
  priority: Priority
  status: HabitStatus
  createdAt: string
}

export interface Checkin {
  id: number
  habitId: number
  date: string
  completedCount: number
  status: CheckinStatus
}

export interface Goal {
  id: number
  habitId: number
  targetType: TargetType
  targetValue: number
}