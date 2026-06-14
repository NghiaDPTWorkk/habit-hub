import React, { useState } from 'react'
import { Box, Button, Card, IconButton, Stack, Typography } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { ProgressBar } from './ProgressBar'
import { useBoundStore } from '@/store/useBoundStore'
import { GOALS_CONTENT } from '../constants/content'
import { useGoalMilestoneNotifications, useGoalProgressMap } from '../hooks'
import { SHARED_MESSAGES } from '@/constants/messages'
import type { Goal } from '@/types'

interface GoalPanelProps {
  onEditGoal?: (goal: Goal) => void
}

const EMPTY_STATE_ICON = '🎯'
const DATE_SEPARATOR = '/'
const COLON_SEPARATOR = ': '
const FILTER_ALL = GOALS_CONTENT.FILTER.ALL
const FILTER_ACTIVE = GOALS_CONTENT.FILTER.ACTIVE
const FILTER_COMPLETED = GOALS_CONTENT.FILTER.COMPLETED
const FILTER_EMPTY = GOALS_CONTENT.FILTER_EMPTY_STATE

export const GoalPanel: React.FC<GoalPanelProps> = ({ onEditGoal }) => {
  const { goals, deleteGoal, habits, showToast } = useBoundStore()
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const progressMap = useGoalProgressMap()

  useGoalMilestoneNotifications()

  const handleDeleteGoal = (goalId: string): void => {
    deleteGoal(goalId)
    showToast(SHARED_MESSAGES.SUCCESS.DELETE, 'success')
  }

  const getHabitName = (habitId: number): string =>
    habits.find((h) => h.id === habitId)?.name || 'Unknown Habit'

  const getTargetLabel = (goal: Goal): string =>
    goal.targetType === 'streak'
      ? GOALS_CONTENT.TARGET_TYPES.STREAK
      : GOALS_CONTENT.TARGET_TYPES.TOTAL_COMPLETIONS

  const filteredGoals = goals.filter((goal) => {
    const progress = progressMap.get(goal.id)
    if (filter === 'completed') return progress?.isCompleted ?? false
    if (filter === 'active') return !(progress?.isCompleted ?? false)
    return true
  })

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button
          variant={filter === 'all' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setFilter('all')}
        >
          {FILTER_ALL}
        </Button>
        <Button
          variant={filter === 'active' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setFilter('active')}
        >
          {FILTER_ACTIVE}
        </Button>
        <Button
          variant={filter === 'completed' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setFilter('completed')}
        >
          {FILTER_COMPLETED}
        </Button>
      </Stack>

      {filteredGoals.length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center', backgroundColor: 'background.paper' }}>
          <Typography sx={{ fontSize: 48, mb: 2 }}>{EMPTY_STATE_ICON}</Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {goals.length === 0 ? GOALS_CONTENT.EMPTY_STATE : FILTER_EMPTY}
          </Typography>
        </Card>
      ) : (
        filteredGoals.map((goal) => {
          const progress = progressMap.get(goal.id)
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
                      <ProgressBar value={progress?.percentage ?? 0} />
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary', mt: 1, display: 'block' }}
                      >
                        {progress?.currentValue ?? 0}
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
        })
      )}
    </Stack>
  )
}

export default GoalPanel
