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
    UNDO: 'Undo',
  },
  PLACEHOLDERS: {
    NO_HABITS_TITLE: 'You have no habits yet',
    NO_HABITS_CTA: 'Create your first habit',
    NO_HABITS_SCHEDULED: 'No habits scheduled for this date',
    NO_CHECKINS: 'No check-ins for this date.',
  },
  MESSAGES: {
    UNDO_SUCCESS: 'Last check-in action undone.',
  },
}
