export type TargetType = 'Streak' | 'Total'

export interface Goal {
  id: number
  habitId: number
  targetType: TargetType
  targetValue: number
}
