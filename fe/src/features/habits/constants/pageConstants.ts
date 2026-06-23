export const TEXT_SEARCH_PLACEHOLDER = 'Search habits...'
export const TEXT_CATEGORY_LABEL = 'Category'
export const TEXT_FREQUENCY_LABEL = 'Frequency'
export const TEXT_STATUS_LABEL = 'Status'
export const TEXT_ALL_CATEGORIES = 'All Categories'
export const TEXT_ALL_FREQUENCIES = 'All Frequencies'
export const TEXT_ALL_STATUSES = 'All Status'

export const TEXT_PRIORITY_LABEL = 'Priority:'
export const TEXT_CLEAR_FILTERS = 'Clear filters'

export const TEXT_VAL_ALL = 'All'
export const TEXT_VAL_HEALTH = 'Health'
export const TEXT_VAL_STUDY = 'Study'
export const TEXT_VAL_WORK = 'Work'
export const TEXT_VAL_MINDFULNESS = 'Mindfulness'
export const TEXT_VAL_OTHER = 'Other'
export const TEXT_VAL_DAILY = 'Daily'
export const TEXT_VAL_SPECIFIC = 'Specific'
export const TEXT_VAL_ACTIVE = 'Active'
export const TEXT_VAL_PAUSED = 'Paused'
export const TEXT_VAL_ARCHIVED = 'Archived'

export const PAGE_TITLE = 'Habits Personal'
export const PAGE_DESC = ''
export const ADD_HABIT_LABEL = 'Add Habit'

export const CATEGORY_OPTIONS = [
  { value: 'All', label: TEXT_ALL_CATEGORIES },
  { value: 'Health', label: TEXT_VAL_HEALTH },
  { value: 'Study', label: TEXT_VAL_STUDY },
  { value: 'Work', label: TEXT_VAL_WORK },
  { value: 'Mindfulness', label: TEXT_VAL_MINDFULNESS },
  { value: 'Other', label: TEXT_VAL_OTHER },
] as const

export const FREQUENCY_OPTIONS = [
  { value: 'All', label: TEXT_ALL_FREQUENCIES },
  { value: 'Daily', label: TEXT_VAL_DAILY },
  { value: 'Specific', label: TEXT_VAL_SPECIFIC },
] as const

export const STATUS_OPTIONS = [
  { value: 'All', label: TEXT_ALL_STATUSES },
  { value: 'Active', label: TEXT_VAL_ACTIVE },
  { value: 'Paused', label: TEXT_VAL_PAUSED },
  { value: 'Archived', label: TEXT_VAL_ARCHIVED },
] as const

export const PRIORITY_OPTIONS = [
  { value: 'All', label: TEXT_VAL_ALL },
  { value: 'High', label: 'High Priority' },
  { value: 'Medium', label: 'Medium Priority' },
  { value: 'Low', label: 'Low Priority' },
] as const
