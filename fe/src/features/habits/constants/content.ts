import type { Category, Frequency, Priority } from '@/types'

export const HABIT_FORM_CONTENT = {
  TITLE_CREATE: 'Create New Habit',
  TITLE_EDIT: 'Edit Habit',
  SPECIFIC_DAYS_LABEL: 'Select days of the week',
  DAY_LABELS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  CATEGORY_OPTIONS: [
    { value: 'Health' as Category, label: 'Health' },
    { value: 'Study' as Category, label: 'Study' },
    { value: 'Work' as Category, label: 'Work' },
    { value: 'Mindfulness' as Category, label: 'Mindfulness' },
    { value: 'Other' as Category, label: 'Other' },
  ],
  FREQUENCY_OPTIONS: [
    { value: 'Daily' as Frequency, label: 'Daily' },
    { value: 'Specific' as Frequency, label: 'Specific days' },
  ],
  PRIORITY_OPTIONS: [
    { value: 'Low' as Priority, label: 'Low' },
    { value: 'Medium' as Priority, label: 'Medium' },
    { value: 'High' as Priority, label: 'High' },
  ],
}

export const HABITS_CONTENT = {
  TITLE: 'Habit Management',
  SUBTITLE: 'Build a healthy lifestyle every day with Habit Tracker',
  BUTTONS: {
    CREATE: 'Create new habit',
    EDIT: 'Edit',
    DELETE: 'Delete habit',
    PAUSE: 'Pause',
    RESUME: 'Activate',
    ARCHIVE: 'Archive',
    CONFIRM_DELETE: 'Confirm Delete',
    CANCEL: 'Cancel',
  },
  FORM: {
    NAME_LABEL: 'Habit Name',
    NAME_PLACEHOLDER: 'e.g., Running, Reading...',
    CATEGORY_LABEL: 'Category',
    FREQUENCY_LABEL: 'Frequency',
    PRIORITY_LABEL: 'Priority',
    TARGET_LABEL: 'Target per day',
  },
  PLACEHOLDERS: {
    EMPTY_LIST:
      "You haven't created any habits yet. Click the button above to create your first habit!",
    NO_MATCH_FILTER: 'No habits found matching the current filters.',
  },
}

export const HABIT_CARD_CONTENT = {
  SHORT_WEEK_DAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  WEEK_DAYS_MAP: [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
  ],
  TEXT_ACCUMULATED_DAYS: ' days',
  TEXT_TARGET_PREFIX: 'Target: ',
  TEXT_SLASH: '/',
  CARD_TEXTS: {
    scheduled: 'Scheduled on',
    dueToday: 'Due today.',
    missed: 'Missed today',
    completed: 'Completed',
    today: 'today',
    edit: 'Edit',
    delete: 'Delete',
    pause: 'Pause',
    resume: 'Resume',
    restore: 'Restore',
    archive: 'Archive',
    daily: 'Daily',
    specificDays: 'Specific days',
    targetLabel: 'Target:',
    priorityLabel: 'Priority:',
    statusLabel: 'Status:',
    dot: '.',
    slash: '/',
    noteLabel: 'Note today:',
    addNote: 'Add note',
    editNote: 'Edit note',
    notePlaceholder: 'Write your note here...',
    cancel: 'Cancel',
    save: 'Save',
  },
  DESCRIPTIONS: {
    Health: 'Maintain good health and fitness daily.',
    Study: 'Acquire knowledge and develop new skills.',
    Work: 'Focus on work and optimize productivity.',
    Mindfulness: 'Keep a peaceful mind and balance life.',
    Default: 'Track and build better habits.',
  } as Record<string, string>,
}
