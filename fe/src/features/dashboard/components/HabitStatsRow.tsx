import React from 'react'
import { Box, Typography, Tooltip, ProgressBar } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import type { HabitSummary } from '@/types'

const HABIT_STATS_GRID_COLS = {
  xs: '1fr 70px 100px',
  sm: 'minmax(120px, 2fr) 80px 80px 80px 140px',
}

const STREAK_SUFFIX = 'd'
const AT_RISK_LABEL = 'At risk'

export interface HabitStatsRowProps {
  summary: HabitSummary
}

export const HabitStatsRow: React.FC<HabitStatsRowProps> = ({ summary }) => {
  const rateValue = Math.round(summary.weeklyCompletionRate * 100)
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
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
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

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: 'center', display: { xs: 'none', sm: 'block' } }}
      >
        {summary.longestStreak}
        {STREAK_SUFFIX}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: 'center', display: { xs: 'none', sm: 'block' } }}
      >
        {summary.totalCompletions}
      </Typography>

      <ProgressBar
        value={rateValue}
        color={rateValue >= 70 ? 'success' : rateValue >= 40 ? 'warning' : 'error'}
      />
    </Box>
  )
}

export default HabitStatsRow
