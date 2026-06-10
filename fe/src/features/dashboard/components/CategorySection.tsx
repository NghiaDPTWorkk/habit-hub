import React from 'react'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Tooltip,
} from '@/components/ui'
import { ProgressBar } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import type { HabitSummary, Category } from '@/types'

const GRID_COLS = '2fr 80px 80px 80px 140px'
const COL_HABIT = 'Habit'
const COL_STREAK = 'Current'
const COL_LONGEST = 'Longest'
const COL_TOTAL = 'Total'
const COL_RATE = '7-day rate'
const STREAK_SUFFIX = 'd'
const AT_RISK_LABEL = 'At risk'

function getAvgRate(habits: HabitSummary[]): number {
  if (habits.length === 0) return 0
  const sum = habits.reduce((acc, h) => acc + h.weeklyCompletionRate, 0)
  return Math.round((sum / habits.length) * 100)
}

const HeaderRow: React.FC = () => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: GRID_COLS,
      gap: 1,
      px: 2,
      py: 1,
      borderBottom: 1,
      borderColor: 'divider',
    }}
  >
    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
      {COL_HABIT}
    </Typography>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ fontWeight: 600, textAlign: 'center' }}
    >
      {COL_STREAK}
    </Typography>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ fontWeight: 600, textAlign: 'center' }}
    >
      {COL_LONGEST}
    </Typography>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ fontWeight: 600, textAlign: 'center' }}
    >
      {COL_TOTAL}
    </Typography>
    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
      {COL_RATE}
    </Typography>
  </Box>
)

// HabitRow will be promoted to a standalone <HabitStatsRow> component in HH-018.
const HabitRow: React.FC<{ summary: HabitSummary }> = ({ summary }) => {
  const rateValue = Math.round(summary.weeklyCompletionRate * 100)
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: GRID_COLS,
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

      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        {summary.longestStreak}
        {STREAK_SUFFIX}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        {summary.totalCompletions}
      </Typography>

      <ProgressBar
        value={rateValue}
        color={rateValue >= 70 ? 'success' : rateValue >= 40 ? 'warning' : 'error'}
      />
    </Box>
  )
}

export interface CategorySectionProps {
  category: Category
  habits: HabitSummary[]
  defaultExpanded?: boolean
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  habits,
  defaultExpanded = false,
}) => {
  const avgLabel = `${getAvgRate(habits)}%`

  return (
    <Accordion defaultExpanded={defaultExpanded} disableGutters elevation={1}>
      <AccordionSummary expandIcon={<Icons.ExpandMore />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', pr: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {category}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {habits.length}
          </Typography>
          <Box sx={{ ml: 'auto' }}>
            <Typography variant="caption" color="text.secondary">
              {avgLabel}
            </Typography>
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <HeaderRow />
        {habits.map((h) => (
          <HabitRow key={h.habitId} summary={h} />
        ))}
      </AccordionDetails>
    </Accordion>
  )
}

export default CategorySection
