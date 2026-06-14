import { type FC } from 'react'
import { useTheme } from '@mui/material/styles'
import { Box, Typography, IconButton } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { Card } from '@/components/ui/Card'
import { HabitOverflowMenu, type HabitOverflowMenuItem } from './HabitOverflowMenu'
import { useCheckinStore } from '@/features/checkins/hooks/useCheckinStore'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import StarIcon from '@mui/icons-material/Star'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import type { Habit } from '@/types'

const SHORT_WEEK_DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

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

const TEXT_ACCUMULATED_DAYS = ' ngày'
const TEXT_TARGET_PREFIX = 'Mục tiêu: '
const TEXT_SLASH = '/'

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
  const { incrementCount, getCheckinByHabitAndDate, today, checkins } = useCheckinStore()
  const currentCheckin = getCheckinByHabitAndDate(habit.id, today) || todayCheckin
  const completedCount = currentCheckin?.completedCount ?? 0
  const accumulatedCount = Object.values(checkins || {}).filter(
    (c) => c.habitId === habit.id && c.completedCount > 0
  ).length
  const scheduledText =
    habit.frequency === 'Daily'
      ? 'Hàng ngày'
      : habit.specificDays?.map((d) => SHORT_WEEK_DAYS[d]).join(', ') || ''
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
        borderLeft: isMissed
          ? `4px solid ${theme.palette.error.main}`
          : `1px solid ${theme.palette.divider}`,
        borderTop: `1px solid ${theme.palette.divider}`,
        borderRight: `1px solid ${theme.palette.divider}`,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        p: 2,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: theme.shadows[2],
          transform: 'translateY(-2px)',
        },
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
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              {getHabitDescription(habit.category)}
            </Typography>
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 1,
            pt: 1,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
              <Typography variant="caption" color="text.secondary">
                {habit.priority}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {scheduledText}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Icons.Whatshot sx={{ fontSize: 16, color: 'error.main' }} />
              <Typography variant="caption" color="text.secondary">
                {accumulatedCount}
                {TEXT_ACCUMULATED_DAYS}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mr: 0.5 }}>
              {TEXT_TARGET_PREFIX}
              {completedCount}
              {TEXT_SLASH}
              {habit.targetPerDay}
            </Typography>
            <IconButton
              onClick={() => onEdit(habit)}
              aria-label="Edit habit"
              size="small"
              sx={{ color: 'text.secondary' }}
            >
              <Icons.Edit fontSize="small" />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation()
                incrementCount(habit.id, today)
              }}
              disabled={habit.status !== 'Active'}
              aria-label="Quick check-in"
              size="small"
              sx={{ color: 'success.main' }}
            >
              {completedCount >= habit.targetPerDay ? (
                <CheckCircleIcon />
              ) : (
                <CheckCircleOutlineIcon />
              )}
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Card>
  )
}
