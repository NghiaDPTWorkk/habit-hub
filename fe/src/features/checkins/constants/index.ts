import type { CheckinStatus } from '@/types'

export const CHECKIN_STATUS_LABEL: Record<CheckinStatus, string> = {
  'Not Started': 'Not Started',
  'In Progress': 'In Progress',
  Completed: 'Completed',
}

export const CHECKIN_CONTENT = {
  TITLE: 'Daily Check-ins',
  SUBTITLE: 'Track your habit progress every day',
  PROGRESS_LABEL: 'Completed today',
  BUTTONS: {
    MARK_DONE: 'Mark as done',
    INCREMENT: 'Increase',
    DECREMENT: 'Decrease',
    EDIT: 'Edit',
  },
  PLACEHOLDERS: {
    NO_HABITS: 'No habits found. Create a habit first!',
    NO_CHECKINS: 'No check-ins for this date.',
  },
}
