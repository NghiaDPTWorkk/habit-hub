import { type FC } from 'react'
import Chip from '@mui/material/Chip'
import { useTheme, alpha } from '@mui/material/styles'
import { Box } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { Card } from '@/components/ui/Card'
import { HabitOverflowMenu, type HabitOverflowMenuItem } from './HabitOverflowMenu'
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
  onDelete: (habit: Habit) => void
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

export const HabitCard: FC<HabitCardProps> = ({
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

  const menuItems: HabitOverflowMenuItem[] = [
    {
      label: CARD_TEXTS.edit,
      icon: <Icons.Edit fontSize="small" />,
      onClick: () => onEdit(habit),
    },
    {
      label: CARD_TEXTS.delete,
      icon: <Icons.Delete fontSize="small" color="error" />,
      onClick: () => onDelete(habit),
    },
    {
      label: nextStatusAction,
      icon:
        habit.status === 'Active' ? (
          <Icons.Pause fontSize="small" />
        ) : (
          <Icons.Play fontSize="small" />
        ),
      onClick: () => onPauseResume(habit),
    },
  ]

  if (habit.status !== 'Archived') {
    menuItems.push({
      label: CARD_TEXTS.archive,
      icon: <Icons.Archive fontSize="small" />,
      onClick: () => onArchive(habit),
    })
  }

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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
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
          </Box>
          <HabitOverflowMenu items={menuItems} />
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
    </Card>
  )
}
