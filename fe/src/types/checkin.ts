export type CheckinStatus = 'Not Started' | 'In Progress' | 'Completed'

export interface Checkin {
  habitId: number
  date: string
  completedCount: number
  status: CheckinStatus
}
