import React from 'react'
import Chip from '@mui/material/Chip'
import { useTheme, alpha } from '@mui/material/styles'
import { Box } from '@/components/ui'
import { Card } from '@/components/ui/Card'
import type { Habit } from '@/types'

const CARD_TEXTS = {
  scheduled: 'Scheduled on',
  dueToday: 'Due today.',
  missed: 'Missed today',
  completed: 'Completed',
  today: 'today',
  daily: 'Daily',
  specificDays: 'Specific days',
  targetLabel: 'Target:',
  priorityLabel: 'Priority:',
  statusLabel: 'Status:',
  dot: '.',
  slash: '/',
}

export interface ReadOnlyHabitCardProps {
  habit: Habit
  todayCheckin?: { completedCount: number }
  isMissed: boolean
  currentDayOfWeek: number
}

const weekDays = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
]

export const ReadOnlyHabitCard: React.FC<ReadOnlyHabitCardProps> = ({
  habit,
  todayCheckin,
  isMissed,
  currentDayOfWeek,
}) => {
  const theme = useTheme()
  const dueToday =
    habit.frequency === 'Daily' || (habit.specificDays?.includes(currentDayOfWeek) ?? false)

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: isMissed ? theme.palette.error.main : theme.palette.divider,
        backgroundColor: isMissed
          ? alpha(theme.palette.error.main, 0.08)
          : theme.palette.background.paper,
        p: 2,
      }}
    >
      <Box sx={{ display: 'grid', gap: 2 }}>
        <Box>
          <Box
            component="h3"
            sx={{
              ...theme.typography.subtitle1,
              fontWeight: 700,
              margin: 0,
              mb: 1,
            }}
          >
            {habit.name}
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            <Chip label={habit.category} size="small" />
            <Chip
              label={habit.frequency === 'Daily' ? CARD_TEXTS.daily : CARD_TEXTS.specificDays}
              size="small"
            />
            <Chip label={`${CARD_TEXTS.targetLabel} ${habit.targetPerDay}`} size="small" />
            <Chip label={`${CARD_TEXTS.priorityLabel} ${habit.priority}`} size="small" />
            <Chip label={`${CARD_TEXTS.statusLabel} ${habit.status}`} size="small" />
          </Box>
          {habit.frequency === 'Specific' && habit.specificDays?.length ? (
            <Box
              component="p"
              sx={{
                ...theme.typography.body2,
                color: theme.palette.text.secondary,
                margin: 0,
                mb: 1,
              }}
            >
              {CARD_TEXTS.scheduled}{' '}
              {habit.specificDays
                .map((day) => weekDays.find((item) => item.value === day)?.label)
                .filter(Boolean)
                .join(', ')}
              {CARD_TEXTS.dot}
            </Box>
          ) : null}
          {dueToday && (
            <Box
              component="p"
              sx={{
                ...theme.typography.body2,
                color: theme.palette.text.secondary,
                margin: 0,
                mb: 0.5,
              }}
            >
              {CARD_TEXTS.dueToday}
            </Box>
          )}
          {isMissed && (
            <Box
              component="p"
              sx={{
                ...theme.typography.body2,
                color: theme.palette.error.main,
                fontWeight: 600,
                margin: 0,
                mb: 0.5,
              }}
            >
              {CARD_TEXTS.missed}
            </Box>
          )}
          {todayCheckin && !isMissed && dueToday && (
            <Box
              component="p"
              sx={{
                ...theme.typography.body2,
                color: (theme) =>
                  theme.palette.mode === 'light' ? 'success.dark' : 'success.main',
                margin: 0,
                mb: 0.5,
              }}
            >
              {CARD_TEXTS.completed} {todayCheckin.completedCount} {CARD_TEXTS.slash}{' '}
              {habit.targetPerDay} {CARD_TEXTS.today}
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  )
}
