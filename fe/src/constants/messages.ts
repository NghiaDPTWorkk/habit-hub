export const SHARED_MESSAGES = {
  SUCCESS: {
    CREATE: 'Data created successfully!',
    UPDATE: 'Data updated successfully!',
    DELETE: 'Data deleted successfully!',
    RESET: 'All data reset successfully!',
    STATUS_CHANGE: 'Status changed successfully!',
    CHECKIN: 'Progress saved successfully!',
    GOAL_CREATED: 'Goal created successfully!',
  },
  ERROR: {
    UNKNOWN: 'A system error occurred, please try again later!',
    NOT_FOUND: 'Requested data not found!',
    INVALID_INPUT: 'Invalid input data!',
    FUTURE_DATE: 'Cannot check-in for a future date!',
    TARGET_EXCEEDED: 'Completed count cannot exceed the daily target!',
    GOAL_EXISTS: 'An active goal already exists for this habit.',
    NOT_SCHEDULED: 'This habit is not scheduled on this day.',
  },
}
