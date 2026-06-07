export type TargetType = 'STREAK' | 'TOTAL_COMPLETIONS'
export type GoalStatus = 'ACTIVE' | 'ACHIEVED'
export type NotifyThreshold = 'NONE' | 'EIGHTY' | 'ONE_HUNDRED'

export interface Goal {
  id: string
  habitId: string
  targetType: TargetType
  targetValue: number // >= 1
  status: GoalStatus
  progressPercent: number // 0..100, derived — stored as 0, recomputed on read
  lastThresholdNotified: NotifyThreshold
  achievedAt: string | null // YYYY-MM-DD
  createdAt: string // YYYY-MM-DD
}

export interface GoalInput {
  targetType: TargetType
  targetValue: number
}

export const TARGET_TYPE_LABELS: Record<TargetType, string> = {
  STREAK: 'Streak target',
  TOTAL_COMPLETIONS: 'Total completions',
}
