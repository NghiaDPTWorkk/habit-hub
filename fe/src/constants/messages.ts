export const SHARED_MESSAGES = {
  SUCCESS: {
    CREATE: 'Data created successfully!',
    UPDATE: 'Data updated successfully!',
    DELETE: 'Data deleted successfully!',
    RESET: 'All data reset successfully!',
    STATUS_CHANGE: 'Status changed successfully!',
  },
  ERROR: {
    UNKNOWN: 'A system error occurred, please try again later!',
    NOT_FOUND: 'Requested data not found!',
    INVALID_INPUT: 'Invalid input data!',
    FUTURE_DATE: 'Cannot check-in for a future date!',
    TARGET_EXCEEDED: 'Completed count cannot exceed the daily target!',
  },
  GOALS: {
    COMPLETED: (goalName: string) =>
      `Congratulations! You completed your goal: ${goalName}!`,
    AT_80_PERCENT: (goalName: string) =>
      `Great progress! You are 80% toward your goal: ${goalName}!`,
  },
}
