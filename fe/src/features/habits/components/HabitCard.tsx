import { type FC } from 'react'
import { useTheme, type Theme } from '@mui/material/styles'
import { Box, Typography, IconButton } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { Card } from '@/components/ui/Card'
import { HabitOverflowMenu, type HabitOverflowMenuItem } from './HabitOverflowMenu'

import { useCheckinStore } from '@/features/checkins/hooks/useCheckinStore'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import type { Habit } from '@/types'

import { HABIT_CARD_CONTENT } from '../constants/content'

const {
  SHORT_WEEK_DAYS,
  WEEK_DAYS_MAP,
  TEXT_ACCUMULATED_DAYS,
  TEXT_TARGET_PREFIX,
  TEXT_SLASH,
  CARD_TEXTS,
  DESCRIPTIONS,
} = HABIT_CARD_CONTENT

const TEXT_CATEGORY_PREFIX = 'Category: '

const getPriorityColor = (priority: string, theme: Theme) => {
  if (priority === 'High') return theme.palette.error.main
  if (priority === 'Medium') return theme.palette.warning.main
  return theme.palette.text.secondary
}

const getHabitDescription = (category: string) => DESCRIPTIONS[category] || DESCRIPTIONS.Default

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
  const { incrementCount, getCheckinByHabitAndDate, today, checkins } = useCheckinStore()
  const currentCheckin = getCheckinByHabitAndDate(habit.id, today) || todayCheckin
  const completedCount = currentCheckin?.completedCount ?? 0
  const accumulatedCount = Object.values(checkins || {}).filter(
    (c) => c.habitId === habit.id && c.completedCount > 0
  ).length
  const scheduledText =
    habit.frequency === 'Daily'
      ? 'Daily'
      : habit.specificDays?.map((d) => SHORT_WEEK_DAYS[d]).join(', ') || ''

  return (
    <Card
      variant="outlined"
      sx={{
        borderLeft: isMissed
          ? `4px solid ${getPriorityColor(habit.priority, theme)}`
          : `1px solid ${theme.palette.divider}`,
        borderTop: `1px solid ${theme.palette.divider}`,
        borderRight: `1px solid ${theme.palette.divider}`,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        p: 1.5,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: theme.shadows[2],
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box sx={{ display: 'grid', gap: 1 }}>
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
                mb: 0.25,
              }}
            >
              <Box
                component="span"
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: getPriorityColor(habit.priority, theme),
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
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0, display: 'block' }}>
              {getHabitDescription(habit.category)}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0 }}>
              {TEXT_CATEGORY_PREFIX}
              {habit.category}
            </Typography>
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
              mb: 0,
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
            mt: 0.5,
            pt: 0.5,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StarBorderIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography
                variant="caption"
                sx={{ color: getPriorityColor(habit.priority, theme), fontWeight: 600 }}
              >
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
              <Icons.Whatshot sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
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
              sx={{
                border: '1px solid',
                borderColor: completedCount >= habit.targetPerDay ? 'success.main' : 'divider',
                borderRadius: '50%',
                color: completedCount >= habit.targetPerDay ? 'success.main' : 'text.secondary',
                bgcolor: completedCount >= habit.targetPerDay ? 'success.light' : 'transparent',
                p: 0.5,
                '&:hover': {
                  bgcolor: completedCount >= habit.targetPerDay ? 'success.light' : 'action.hover',
                  borderColor:
                    completedCount >= habit.targetPerDay ? 'success.dark' : 'text.secondary',
                },
              }}
            >
              <Icons.Check sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Card>
  )
}
