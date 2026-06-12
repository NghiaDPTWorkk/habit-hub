import React from 'react'
import { Box, Typography, Card, IconButton, Tooltip, Checkbox } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { useCheckinStore } from '../hooks'
import type { Habit, Checkin } from '@/types'

const LABEL_CATEGORY = 'Category: '
const LABEL_PRIORITY = ' | Priority: '
const LABEL_EDIT = 'Edit Progress'
const LABEL_CHECKIN = 'Check-in'

const CATEGORY_THEME_COLORS: Record<string, string> = {
  Health: 'success.main',
  Study: 'info.main',
  Work: 'primary.main',
  Mindfulness: 'secondary.main',
  Other: 'warning.main',
}

export interface CheckinItemCardProps {
  habit: Habit
  checkin: Checkin | undefined
  today: string
  onOpenModal: () => void
}

export const CheckinItemCard: React.FC<CheckinItemCardProps> = ({
  habit,
  checkin,
  today,
  onOpenModal,
}) => {
  const { markComplete, upsertCheckin } = useCheckinStore()
  const completedCount = checkin?.completedCount ?? 0
  const isChecked = checkin?.status === 'Completed'

  const handleToggle = () => {
    if (isChecked) {
      upsertCheckin(habit.id, today, { completedCount: 0, status: 'Not Started' })
    } else {
      markComplete(habit.id, today)
    }
  }

  const categoryColor = CATEGORY_THEME_COLORS[habit.category] || 'text.secondary'
  const progressText =
    habit.targetPerDay > 1 ? ` | Progress: ${completedCount}/${habit.targetPerDay}` : ''
  const subtitleText = `${LABEL_CATEGORY}${habit.category}${LABEL_PRIORITY}${habit.priority}${progressText}`

  return (
    <Card sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left Part: Dot and Title/Subtitle */}
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1, pr: 2 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: categoryColor,
              mr: 1.5,
              flexShrink: 0,
            }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {habit.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {subtitleText}
            </Typography>
          </Box>
        </Box>

        {/* Right Part: Edit and Checkin Toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          <Tooltip title={LABEL_EDIT}>
            <IconButton size="small" onClick={onOpenModal}>
              <Icons.Edit fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title={LABEL_CHECKIN}>
            <Checkbox
              checked={isChecked}
              onChange={handleToggle}
              sx={{
                color: 'action.disabled',
                p: 0.5,
                '&.Mui-checked': {
                  color: 'success.main',
                },
              }}
            />
          </Tooltip>
        </Box>
      </Box>
    </Card>
  )
}
