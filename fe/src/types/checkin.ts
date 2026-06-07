export type CompletionStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'

export interface CheckIn {
  id: string | null // null for synthesised NOT_STARTED rows
  habitId: string
  date: string // YYYY-MM-DD
  completedCount: number
  note: string | null
  completionStatus: CompletionStatus // computed at read time, not stored
}

export interface CheckInInput {
  habitId: string
  date: string
  completedCount: number
  note?: string | null
}

export interface DateRange {
  start: string // YYYY-MM-DD
  end: string // YYYY-MM-DD
}

export const COMPLETION_STATUS_LABELS: Record<CompletionStatus, string> = {
  NOT_STARTED: 'Not started',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
}
