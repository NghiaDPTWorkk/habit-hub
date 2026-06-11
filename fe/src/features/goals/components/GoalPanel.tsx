import React, { useState } from 'react'
import { Box, Card, IconButton, Stack, Typography } from '@/components/ui'
import { pxToRem } from '@/utils'
import { Icons } from '@/components/ui/icons'
import { GoalProgressBar } from './GoalProgressBar'
import { GoalEditDialog } from './GoalEditDialog'
import { useBoundStore } from '@/store/useBoundStore'
import { GOALS_CONTENT } from '../constants/content'
import { computeCurrentValue } from '../services'
import { useGoalMilestoneNotifications } from '../hooks'
import type { Goal } from '@/types'

const EMPTY_STATE_ICON = '🎯'

export const GoalPanel: React.FC = () => {
  const goals = useBoundStore((s) => s.goals)
  const checkins = useBoundStore((s) => s.checkins)
  const habits = useBoundStore((s) => s.habits)
  const deleteGoal = useBoundStore((s) => s.deleteGoal)
  const getGoalProgress = useBoundStore((s) => s.getGoalProgress)

  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  useGoalMilestoneNotifications()

  if (goals.length === 0) {
    return (
      <Card sx={{ p: 6, textAlign: 'center', backgroundColor: 'background.paper' }}>
        <Typography sx={{ fontSize: pxToRem(48), mb: 2 }}>{EMPTY_STATE_ICON}</Typography>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {GOALS_CONTENT.EMPTY_TITLE}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {GOALS_CONTENT.EMPTY_DESC}
        </Typography>
      </Card>
    )
  }

  return (
    <>
      <Stack spacing={2}>
        {goals.map((goal) => {
          const currentValue = computeCurrentValue(goal, checkins)
          const progress = getGoalProgress(goal, currentValue)
          const habitName =
            habits.find((h) => h.id === goal.habitId)?.name ?? GOALS_CONTENT.UNKNOWN_HABIT
          const targetTypeLabel =
            goal.targetType === 'streak'
              ? GOALS_CONTENT.TARGET_TYPES.STREAK
              : GOALS_CONTENT.TARGET_TYPES.TOTAL

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
                        {GOALS_CONTENT.GOAL_META(targetTypeLabel, goal.targetValue)}
                      </Typography>
                    </Box>
                    <Box>
                      <GoalProgressBar value={progress.percentage} />
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary', mt: 1, display: 'block' }}
                      >
                        {GOALS_CONTENT.CURRENT_OF_TARGET(currentValue, goal.targetValue)}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                  <IconButton
                    size="small"
                    onClick={() => setEditingGoal(goal)}
                    sx={{ color: 'primary.main' }}
                  >
                    <Icons.Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => deleteGoal(goal.id)}
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

      <GoalEditDialog
        key={editingGoal?.id}
        goal={editingGoal}
        open={editingGoal !== null}
        onClose={() => setEditingGoal(null)}
      />
    </>
  )
}
