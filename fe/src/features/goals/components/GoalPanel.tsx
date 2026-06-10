import React, { useEffect } from 'react'
import { Box, Card, IconButton, Stack, Typography } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { ProgressBar } from './ProgressBar'
import { useBoundStore } from '@/store/useBoundStore'
import { SHARED_MESSAGES } from '@/constants/messages'
import { GOALS_CONTENT } from '../constants/content'
import type { Goal } from '@/types'

interface GoalPanelProps {
  onEditGoal?: (goal: Goal) => void
}

const EMPTY_STATE_ICON = '🎯'
const DATE_SEPARATOR = '/'
const COLON_SEPARATOR = ': '
const NOTIFIED_GOALS_KEY = 'habit-hub-notified-goals'

const getNotifiedGoals = (): Set<string> => {
  try {
    const raw = localStorage.getItem(NOTIFIED_GOALS_KEY)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

const saveNotifiedGoal = (key: string): void => {
  try {
    const current = getNotifiedGoals()
    current.add(key)
    localStorage.setItem(NOTIFIED_GOALS_KEY, JSON.stringify([...current]))
  } catch {
    // ignore
  }
}

export const GoalPanel: React.FC<GoalPanelProps> = ({ onEditGoal }) => {
  const { goals, checkins, deleteGoal, getGoalProgress, habits, showToast } = useBoundStore()

  useEffect(() => {
    const notified = getNotifiedGoals()

    goals.forEach((goal) => {
      const progress = getGoalProgress(goal, checkins)
      const completedKey = `${goal.id}-completed`
      const at80Key = `${goal.id}-80percent`

      if (progress.isCompleted && !notified.has(completedKey)) {
        saveNotifiedGoal(completedKey)
        showToast(SHARED_MESSAGES.GOALS.COMPLETED, 'success')
      } else if (progress.isAt80Percent && !notified.has(at80Key)) {
        saveNotifiedGoal(at80Key)
        showToast(SHARED_MESSAGES.GOALS.AT_80_PERCENT, 'info')
      }
    })
  }, [goals, checkins, getGoalProgress, showToast])

  const handleDeleteGoal = (goalId: string): void => {
    deleteGoal(goalId)
  }

  const getHabitName = (habitId: number): string => {
    return habits.find((h) => h.id === habitId)?.name || 'Unknown Habit'
  }

  const getTargetLabel = (goal: Goal): string => {
    if (goal.targetType === 'streak') {
      return GOALS_CONTENT.TARGET_TYPES.STREAK
    }
    return GOALS_CONTENT.TARGET_TYPES.TOTAL_COMPLETIONS
  }

  if (goals.length === 0) {
    return (
      <Card sx={{ p: 6, textAlign: 'center', backgroundColor: 'background.paper' }}>
        <Typography sx={{ fontSize: 48, mb: 2 }}>{EMPTY_STATE_ICON}</Typography>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {GOALS_CONTENT.EMPTY_STATE}
        </Typography>
      </Card>
    )
  }

  return (
    <Stack spacing={2}>
      {goals.map((goal) => {
        const progress = getGoalProgress(goal, checkins)
        const habitName = getHabitName(goal.habitId)
        const targetLabel = getTargetLabel(goal)

        return (
          <Card key={goal.id} sx={{ p: 3, borderRadius: 2 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {habitName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {targetLabel}
                      {COLON_SEPARATOR}
                      {goal.targetValue}
                    </Typography>
                  </Box>
                  <Box>
                    <ProgressBar value={progress.percentage} />
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary', mt: 1, display: 'block' }}
                    >
                      {progress.currentValue}
                      {DATE_SEPARATOR}
                      {goal.targetValue}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                <IconButton
                  size="small"
                  onClick={() => onEditGoal?.(goal)}
                  sx={{ color: 'primary.main' }}
                >
                  <Icons.Edit fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteGoal(goal.id)}
                  sx={{ color: 'error.main' }}
                >
                  <Icons.Delete fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Card>
        )
      })}
    </Stack>
  )
}

export default GoalPanel