import React, { useRef, useEffect, useState } from 'react'
import {
  Box,
  Card,
  IconButton,
  Stack,
  Typography,
  Snackbar,
  Alert,
} from '@/components/ui'
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
const COLON_SEPARATOR = ':'

export const GoalPanel: React.FC<GoalPanelProps> = ({ onEditGoal }) => {
  const { goals, checkins, deleteGoal, getGoalProgress, habits } = useBoundStore()
  const notifiedGoalsRef = useRef<Set<string>>(new Set())
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [currentNotification, setCurrentNotification] = useState<{
    message: string
    type: 'success' | 'info'
  } | null>(null)

  useEffect(() => {
    goals.forEach((goal) => {
      const progress = getGoalProgress(goal, checkins)
      const notificationKey = `${goal.id}`

      if (progress.isCompleted && !notifiedGoalsRef.current.has(`${notificationKey}-completed`)) {
        notifiedGoalsRef.current.add(`${notificationKey}-completed`)
        setCurrentNotification({
          message: SHARED_MESSAGES.GOALS.COMPLETED,
          type: 'success',
        })
        setOpenSnackbar(true)
      } else if (
        progress.isAt80Percent &&
        !notifiedGoalsRef.current.has(`${notificationKey}-80percent`)
      ) {
        notifiedGoalsRef.current.add(`${notificationKey}-80percent`)
        setCurrentNotification({
          message: SHARED_MESSAGES.GOALS.AT_80_PERCENT,
          type: 'info',
        })
        setOpenSnackbar(true)
      }
    })
  }, [goals, checkins, getGoalProgress])

  const handleCloseSnackbar = (): void => {
    setOpenSnackbar(false)
  }

  const handleDeleteGoal = (goalId: string): void => {
    deleteGoal(goalId)
  }

  const getHabitName = (habitId: string): string => {
    return habits.find((h) => String(h.id) === String(habitId))?.name || 'Unknown Habit'
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
    <>
      <Stack spacing={2}>
        {goals.map((goal) => {
          const progress = getGoalProgress(goal, checkins)
          const progressStatus =
            progress.isCompleted ? 'completed' : progress.isAt80Percent ? 'warning' : 'normal'
          const habitName = getHabitName(goal.habitId)
          const targetLabel = getTargetLabel(goal)

          return (
            <Card key={goal.id} sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ flex: { xs: 1, sm: '0 0 66.666667%' } }}>
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {habitName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {targetLabel}
                        {COLON_SEPARATOR}
                        {goal.targetValue}
                      </Typography>
                    </Box>
                    <ProgressBar value={progress.percentage} status={progressStatus} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {progress.currentValue}
                      {DATE_SEPARATOR}
                      {goal.targetValue}
                    </Typography>
                  </Stack>
                </Box>
                <Box sx={{ flex: { xs: 1, sm: '0 0 33.333333%' }, display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, gap: 1 }}>
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

      {currentNotification && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={currentNotification.type} sx={{ width: '100%' }}>
            {currentNotification.message}
          </Alert>
        </Snackbar>
      )}
    </>
  )
}

export default GoalPanel
