import React from 'react'
import { Box, Typography, Tooltip } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import type { HabitSummary } from '@/types'
import { HABIT_STATS_GRID_COLS } from './habitStatsConfig'

const STREAK_SUFFIX = 'd'
const AT_RISK_LABEL = 'At risk'

export interface HabitStatsRowProps {
  summary: HabitSummary
}

export const HabitStatsRow: React.FC<HabitStatsRowProps> = ({ summary }) => {
  const rateValue = Math.round(summary.weeklyCompletionRate * 100)
  const rateLabel = `${rateValue}%`
  const rateColor = rateValue >= 70 ? 'success' : rateValue >= 40 ? 'warning' : 'error'

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: HABIT_STATS_GRID_COLS,
        gap: 1,
        px: 2,
        py: 1.5,
        alignItems: 'center',
        borderBottom: 1,
        borderColor: 'divider',
        '&:last-child': { borderBottom: 0 },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 500, wordBreak: 'break-word' }}>
          {summary.habitName}
        </Typography>
        {summary.isAtRisk && (
          <Tooltip title={AT_RISK_LABEL}>
            <Box component="span" sx={{ color: 'warning.main', display: 'flex', flexShrink: 0 }}>
              <Icons.WarningAmber fontSize="small" />
            </Box>
          </Tooltip>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
        <Box sx={{ color: 'warning.main', display: 'flex' }}>
          <Icons.Whatshot fontSize="small" />
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {summary.currentStreak}
          {STREAK_SUFFIX}
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        {summary.longestStreak}
        {STREAK_SUFFIX}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        {summary.totalCompletions}
      </Typography>

      <Typography
        variant="body2"
        sx={{ textAlign: 'right', fontWeight: 600, color: `${rateColor}.main` }}
      >
        {rateLabel}
      </Typography>
    </Box>
  )
}

export default HabitStatsRow
