import React from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import { useTheme, alpha } from '@mui/material/styles'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { Habit } from '@/types'

const CARD_TEXTS = {
  scheduled: 'Scheduled on',
  dueToday: 'Due today.',
  missed: 'Missed today',
  completed: 'Completed',
  today: 'today',
  edit: 'Edit',
  delete: 'Delete',
  pause: 'Pause',
  resume: 'Resume',
  restore: 'Restore',
  archive: 'Archive',
  daily: 'Daily',
  specificDays: 'Specific days',
  targetLabel: 'Target:',
  priorityLabel: 'Priority:',
  statusLabel: 'Status:',
  dot: '.',
  slash: '/',
}

export interface HabitCardProps {
  habit: Habit
  todayCheckin?: {
    completedCount: number
  }
  isMissed: boolean
  onEdit: (habit: Habit) => void
  onDelete: (habitId: number) => void
  onPauseResume: (habit: Habit) => void
  onArchive: (habit: Habit) => void
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

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  todayCheckin,
  isMissed,
  onEdit,
  onDelete,
  onPauseResume,
  onArchive,
}) => {
  const theme = useTheme()
  const dueToday =
    habit.frequency === 'Daily' || (habit.specificDays?.includes(new Date().getDay()) ?? false)
  const nextStatusAction =
    habit.status === 'Paused'
      ? CARD_TEXTS.resume
      : habit.status === 'Archived'
        ? CARD_TEXTS.restore
        : CARD_TEXTS.pause

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
                mb: 1,
                margin: 0,
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
                mb: 0.5,
                margin: 0,
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
                mb: 0.5,
                margin: 0,
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
                color: theme.palette.success.main,
                mb: 0.5,
                margin: 0,
              }}
            >
              {CARD_TEXTS.completed} {todayCheckin.completedCount} {CARD_TEXTS.slash}{' '}
              {habit.targetPerDay} {CARD_TEXTS.today}
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Button variant="outlined" onClick={() => onEdit(habit)}>
            {CARD_TEXTS.edit}
          </Button>
          <Button variant="outlined" color="error" onClick={() => onDelete(habit.id)}>
            {CARD_TEXTS.delete}
          </Button>
          <Button variant="contained" onClick={() => onPauseResume(habit)}>
            {nextStatusAction}
          </Button>
          {habit.status !== 'Archived' && (
            <Button variant="outlined" onClick={() => onArchive(habit)}>
              {CARD_TEXTS.archive}
            </Button>
          )}
        </Box>
      </Box>
    </Card>
  )
}
