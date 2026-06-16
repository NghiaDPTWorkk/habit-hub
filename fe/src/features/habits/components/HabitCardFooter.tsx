import { type FC } from 'react'
import { Box, Typography, IconButton, useTheme } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { pxToRem } from '@/utils'
import type { Habit } from '@/types'
import { getPriorityColor } from '../utils/habitHelpers'

export interface HabitCardFooterProps {
  habit: Habit
  scheduledText: string
  onEditNote: () => void
}

export const HabitCardFooter: FC<HabitCardFooterProps> = ({ habit, scheduledText, onEditNote }) => {
  const theme = useTheme()
  const priorityColor = getPriorityColor(habit.priority, theme)

  return (
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
              fontWeight: 600,
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
            sx={{ color: 'text.secondary', fontSize: { xs: pxToRem(11), sm: pxToRem(12) } }}
          >
            {scheduledText}
          </Typography>
        </Box>
      </Box>

      {/* Target & Action Box */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
        <IconButton
          onClick={(e) => {
            e.stopPropagation()
            onEditNote()
          }}
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          <Icons.Edit sx={{ fontSize: { xs: 14, sm: 16 } }} />
        </IconButton>
      </Box>
    </Box>
  )
}
