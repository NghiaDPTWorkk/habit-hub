import React from 'react'
import { Box, Typography } from '@/components/ui'
import { pxToRem } from '@/utils'
import type { Habit } from '@/types'

export interface DayTrendData {
  date: Date
  dateStr: string
  dayLabel: string
  scheduled: Habit[]
  completed: Habit[]
  pending: Habit[]
  rate: number
}

interface WeeklyTrendTooltipProps {
  d: DayTrendData
  isToday: boolean
}

const TXT_COMPLETION = 'Completion: '
const TXT_SLASH = '/'
const TXT_HABITS_OPEN = ' habits ('
const TXT_PCT_CLOSE = '%)'
const TXT_COMPLETED_LABEL = 'Completed:'
const TXT_CHECK = '✓ '
const TXT_PENDING_LABEL = 'Pending:'
const TXT_BULLET = '• '
const TXT_NO_HABITS = 'No habits scheduled'
const TXT_TODAY = '(Today)'

export const WeeklyTrendTooltip: React.FC<WeeklyTrendTooltipProps> = ({ d, isToday }) => {
  const fmtDate = d.date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

  return (
    <Box sx={{ p: 0.5 }}>
      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
        {fmtDate} {isToday && TXT_TODAY}
      </Typography>
      <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
        {TXT_COMPLETION}
        {d.completed.length}
        {TXT_SLASH}
        {d.scheduled.length}
        {TXT_HABITS_OPEN}
        {Math.round(d.rate * 100)}
        {TXT_PCT_CLOSE}
      </Typography>
      {d.completed.length > 0 && (
        <Box sx={{ mt: 0.5 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, color: 'success.main', display: 'block' }}
          >
            {TXT_COMPLETED_LABEL}
          </Typography>
          {d.completed.map((h) => (
            <Typography
              key={h.id}
              variant="caption"
              sx={{ display: 'block', pl: 1, fontSize: pxToRem(11) }}
            >
              {TXT_CHECK}
              {h.name}
            </Typography>
          ))}
        </Box>
      )}
      {d.pending.length > 0 && (
        <Box sx={{ mt: 0.5 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, color: 'warning.main', display: 'block' }}
          >
            {TXT_PENDING_LABEL}
          </Typography>
          {d.pending.map((h) => (
            <Typography
              key={h.id}
              variant="caption"
              sx={{ display: 'block', pl: 1, fontSize: pxToRem(11) }}
            >
              {TXT_BULLET}
              {h.name}
            </Typography>
          ))}
        </Box>
      )}
      {d.scheduled.length === 0 && (
        <Typography variant="caption" sx={{ fontStyle: 'italic', display: 'block' }}>
          {TXT_NO_HABITS}
        </Typography>
      )}
    </Box>
  )
}
export default WeeklyTrendTooltip
