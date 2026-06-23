import React from 'react'
import { useTheme, alpha } from '@mui/material/styles'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import EditNoteIcon from '@mui/icons-material/EditNote'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Box, Typography, IconButton } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { Card } from '@/components/ui/Card'
import { pxToRem } from '@/utils'
import type { Habit } from '@/types'
import { getPriorityColor } from '../utils/habitHelpers'
import { HABIT_CARD_CONTENT } from '../constants/content'

const { SHORT_WEEK_DAYS, CARD_TEXTS } = HABIT_CARD_CONTENT

const TEXT_CATEGORY_LABEL = 'Category: '

export interface ReadOnlyHabitCardProps {
  habit: Habit
  todayCheckin?: { completedCount: number }
  isMissed: boolean
  currentDayOfWeek: number
}

export const ReadOnlyHabitCard: React.FC<ReadOnlyHabitCardProps> = ({
  habit,
  todayCheckin,
  isMissed,
  currentDayOfWeek,
}) => {
  const theme = useTheme()
  const dueToday =
    habit.frequency === 'Daily' || (habit.specificDays?.includes(currentDayOfWeek) ?? false)

  const priorityColor = getPriorityColor(habit.priority, theme)

  const scheduledText =
    habit.frequency === 'Daily'
      ? CARD_TEXTS.daily
      : habit.specificDays?.map((d) => SHORT_WEEK_DAYS[d]).join(', ') || ''

  const completedText = todayCheckin
    ? `${CARD_TEXTS.completed} ${todayCheckin.completedCount} ${CARD_TEXTS.slash} ${habit.targetPerDay} ${CARD_TEXTS.today}`
    : ''

  return (
    <Card
      variant="elevation"
      elevation={1}
      sx={{
        borderRadius: 3,
        borderLeft: `${pxToRem(5)} solid ${priorityColor}`,
        bgcolor: 'background.paper',
        p: { xs: 2, sm: 2.5 },
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: (t) => `0px 4px 20px ${alpha(t.palette.common.black, 0.03)}`,
        border: '1px solid',
        borderColor: 'divider',
        borderLeftColor: priorityColor,
        '&:hover': {
          boxShadow: (t) => `0px 12px 30px ${alpha(t.palette.common.black, 0.08)}`,
          transform: 'translateY(-4px)',
          borderLeftWidth: pxToRem(6),
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 1.25, sm: 1.5 },
          height: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.25, sm: 1.5 } }}>
          {/* Header Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Box
                component="span"
                sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: priorityColor }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, fontSize: pxToRem(15.5), color: 'text.primary' }}
              >
                {habit.name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              <IconButton
                disabled
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&.Mui-disabled': { color: 'text.secondary', opacity: 0.8 },
                }}
              >
                <EditNoteIcon />
              </IconButton>
              <IconButton
                disabled
                size="small"
                sx={{
                  color: 'error.main',
                  '&.Mui-disabled': { color: 'error.main', opacity: 0.8 },
                }}
              >
                <DeleteOutlinedIcon />
              </IconButton>
              <IconButton
                disabled
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&.Mui-disabled': { color: 'text.secondary', opacity: 0.8 },
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Title & Description */}
          <Box>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', fontSize: pxToRem(12), fontWeight: 600 }}
            >
              {TEXT_CATEGORY_LABEL}
              {habit.category}
            </Typography>

            {/* Status Badges Row */}
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mt: 1.25 }}>
              {dueToday && (
                <Box
                  sx={{
                    bgcolor: alpha(theme.palette.success.main, 0.06),
                    color: theme.palette.success.main,
                    border: '1px solid',
                    borderColor: alpha(theme.palette.success.main, 0.2),
                    px: 1,
                    py: 0.25,
                    borderRadius: pxToRem(4),
                    fontSize: pxToRem(10.5),
                    fontWeight: 700,
                  }}
                >
                  {CARD_TEXTS.dueToday}
                </Box>
              )}
              {isMissed && (
                <Box
                  sx={{
                    bgcolor: alpha(theme.palette.error.main, 0.06),
                    color: theme.palette.error.main,
                    border: '1px solid',
                    borderColor: alpha(theme.palette.error.main, 0.2),
                    px: 1,
                    py: 0.25,
                    borderRadius: pxToRem(4),
                    fontSize: pxToRem(10.5),
                    fontWeight: 700,
                  }}
                >
                  {CARD_TEXTS.missed}
                </Box>
              )}
              {todayCheckin && !isMissed && dueToday && (
                <Box
                  sx={{
                    bgcolor: alpha(theme.palette.success.main, 0.06),
                    color: theme.palette.success.main,
                    border: '1px solid',
                    borderColor: alpha(theme.palette.success.main, 0.2),
                    px: 1,
                    py: 0.25,
                    borderRadius: pxToRem(4),
                    fontSize: pxToRem(10.5),
                    fontWeight: 700,
                  }}
                >
                  {completedText}
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Footer Info */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pt: 1.5,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 1, sm: 1.5, md: 2 },
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {/* Priority */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.25, sm: 0.5 } }}>
              <StarBorderIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: 'text.secondary' }} />
              <Typography
                variant="caption"
                sx={{
                  color: priorityColor,
                  fontWeight: 700,
                  fontSize: { xs: pxToRem(11), sm: pxToRem(12) },
                }}
              >
                {habit.priority}
              </Typography>
            </Box>

            {/* Frequency */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.25, sm: 0.5 } }}>
              <CalendarTodayIcon sx={{ fontSize: { xs: 13, sm: 15 }, color: 'text.secondary' }} />
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 600,
                  fontSize: { xs: pxToRem(11), sm: pxToRem(12) },
                }}
              >
                {scheduledText}
              </Typography>
            </Box>
          </Box>

          {/* Edit Note Action Icon (Disabled) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
            <IconButton
              disabled
              size="small"
              sx={{
                color: 'text.secondary',
                '&.Mui-disabled': { color: 'text.secondary', opacity: 0.8 },
              }}
            >
              <Icons.Edit sx={{ fontSize: { xs: 14, sm: 16 } }} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Card>
  )
}
