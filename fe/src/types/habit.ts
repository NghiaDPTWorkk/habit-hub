export type Category = 'Health' | 'Study' | 'Work' | 'Mindfulness' | 'Other'
export type Frequency = 'Daily' | 'Specific'
export type Priority = 'Low' | 'Medium' | 'High'
export type HabitStatus = 'Active' | 'Paused' | 'Archived'

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
