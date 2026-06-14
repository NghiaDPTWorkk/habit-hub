import { type FC } from 'react'
import Chip from '@mui/material/Chip'
import { useTheme, alpha } from '@mui/material/styles'
import { Box, Typography, IconButton } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { Card } from '@/components/ui/Card'
import { HabitOverflowMenu, type HabitOverflowMenuItem } from './HabitOverflowMenu'
import { useCheckinStore } from '@/features/checkins/hooks/useCheckinStore'
import type { Habit } from '@/types'

const CATEGORY_COLORS: Record<string, string> = {
  Health: 'success.main',
  Study: 'info.main',
  Work: 'primary.main',
  Mindfulness: 'secondary.main',
  Other: 'warning.main',
}

const getHabitDescription = (category: string) => {
  switch (category) {
    case 'Health':
      return 'Duy trì sức khỏe và thể lực tốt mỗi ngày.'
    case 'Study':
      return 'Tích lũy kiến thức và phát triển kỹ năng.'
    case 'Work':
      return 'Tập trung làm việc và tối ưu hóa hiệu suất.'
    case 'Mindfulness':
      return 'Giữ tâm trí bình yên và cân bằng cuộc sống.'
    default:
      return 'Theo dõi và xây dựng thói quen tốt hơn.'
  }
}

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
  noteLabel: 'Note today:',
  addNote: 'Add note',
  editNote: 'Edit note',
  notePlaceholder: 'Write your note here...',
  cancel: 'Cancel',
  save: 'Save',
}

const WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const WEEK_DAYS_MAP = WEEK_DAYS.map((label, index) => ({
  value: index,
  label,
}))

export interface HabitCardProps {
  habit: Habit
  todayCheckin?: { completedCount: number }
  isMissed: boolean
  onEdit: (habit: Habit) => void
  onDelete: (habit: Habit) => void
  onPauseResume: (habit: Habit) => void
  onArchive: (habit: Habit) => void
}

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
  const { incrementCount, getCheckinByHabitAndDate, today } = useCheckinStore()
  const currentCheckin = getCheckinByHabitAndDate(habit.id, today) || todayCheckin
  const completedCount = currentCheckin?.completedCount ?? 0
  if (habit.id < 0) {
    incrementCount(habit.id, today)
    console.log(completedCount)
  }
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
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 0.5,
              }}
            >
              <Box
                component="span"
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: CATEGORY_COLORS[habit.category] || 'text.secondary',
                  display: 'inline-block',
                }}
              />
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                {habit.name}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
              {getHabitDescription(habit.category)}
            </Typography>
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
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <IconButton size="small" onClick={() => onEdit(habit)} aria-label="Edit habit">
              <Icons.Edit fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(habit)}
              aria-label="Delete habit"
              color="error"
            >
              <Icons.Delete fontSize="small" />
            </IconButton>
            <HabitOverflowMenu items={menuItems} />
          </Box>
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
              .map((day) => WEEK_DAYS_MAP.find((item) => item.value === day)?.label)
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
