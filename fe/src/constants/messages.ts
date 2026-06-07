export const SHARED_MESSAGES = {
  // Nhớ ghi tiếng anh
  SUCCESS: {
    CREATE: 'Habit created',
    UPDATE: 'Habit updated',
    DELETE: 'Habit deleted',
    RESET: 'Data reset to seed state',
    STATUS_CHANGE: 'Status updated',
    CHECKIN: 'Progress saved',
    GOAL_CREATED: 'Goal created',
  },
  ERROR: {
    UNKNOWN: 'Something went wrong. Please try again.',
    NOT_FOUND: 'The requested item could not be found.',
    INVALID_INPUT: 'Invalid input — please check your values.',
    FUTURE_DATE: "Future dates can't be checked in",
    TARGET_EXCEEDED: 'Completed count cannot exceed daily target',
    GOAL_EXISTS: 'An active goal already exists for this habit.',
    NOT_SCHEDULED: 'This habit is not scheduled on this day.',
  },
}
