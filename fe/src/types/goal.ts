export type GoalTargetType = 'streak' | 'total_completions'
export type GoalStatus = 'active' | 'completed' | 'paused'

export interface Goal {
  id: string
  habitId: number
  targetType: GoalTargetType
  targetValue: number
  status: GoalStatus
  createdAt: string
}

export interface GoalProgress {
  goalId: string
  currentValue: number
  percentage: number
  isAt80Percent: boolean
  isCompleted: boolean
}
