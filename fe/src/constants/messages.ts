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
    COMPLETED: (goalName: string) => `Goal complete! You reached your target for "${goalName}".`,
    AT_80_PERCENT: (goalName: string) =>
      `80% progress on "${goalName}" – almost there, keep going!`,
    VALIDATION_ALL_REQUIRED: 'All fields are required',
    VALIDATION_TARGET_POSITIVE: 'Target value must be greater than 0',
    VALIDATION_INTEGER: 'Target value must be a positive whole number',
  },
}
