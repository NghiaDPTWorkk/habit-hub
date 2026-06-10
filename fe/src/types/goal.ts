export type TargetType = 'streak' | 'total_completions'

export interface Goal {
  id: number
  habitId: number
  targetType: TargetType
  targetValue: number
}
