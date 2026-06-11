export type TargetType = 'streak' | 'total_completions'

export interface Goal {
  id: number
  habitId: number
  targetType: TargetType
  targetValue: number
}

export interface GoalProgress {
  percentage: number
  isEightyPercentReached: boolean
  isCompleted: boolean
}
