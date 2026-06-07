export type CheckinStatus = 'Not Started' | 'In Progress' | 'Completed'

export interface Checkin {
  id: number
  habitId: number
  date: string
  completedCount: number
  status: CheckinStatus
}
