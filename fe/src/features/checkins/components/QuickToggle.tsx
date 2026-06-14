import React from 'react'
import { IconButton, Tooltip } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { useCheckinStore } from '../hooks'

const TOOLTIP_MARK_DONE = 'Mark as done'
const TOOLTIP_UNMARK = 'Unmark'
const COLOR_CHECKED_BG = 'success.main'
const COLOR_CHECKED_TEXT = 'success.contrastText'
const COLOR_CHECKED_HOVER = 'success.dark'
const COLOR_UNCHECKED_BG = 'grey.300'
const COLOR_UNCHECKED_TEXT = 'text.secondary'
const COLOR_UNCHECKED_HOVER = 'grey.400'

export interface QuickToggleProps {
  habitId: number
  date: string
  checked: boolean
}

export const QuickToggle: React.FC<QuickToggleProps> = ({ habitId, date, checked }) => {
  const { markComplete, upsertCheckin } = useCheckinStore()

  const handleToggle = () => {
    if (checked) {
      upsertCheckin(habitId, date, { completedCount: 0, status: 'Not Started' })
    } else {
      markComplete(habitId, date)
    }
  }

  return (
    <Tooltip title={checked ? TOOLTIP_UNMARK : TOOLTIP_MARK_DONE}>
      <IconButton
        onClick={handleToggle}
        aria-label={checked ? TOOLTIP_UNMARK : TOOLTIP_MARK_DONE}
        sx={{
          bgcolor: checked ? COLOR_CHECKED_BG : COLOR_UNCHECKED_BG,
          color: checked ? COLOR_CHECKED_TEXT : COLOR_UNCHECKED_TEXT,
          '&:hover': {
            bgcolor: checked ? COLOR_CHECKED_HOVER : COLOR_UNCHECKED_HOVER,
          },
        }}
      >
        <Icons.Check />
      </IconButton>
    </Tooltip>
  )
}
