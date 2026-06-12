import React from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import type { HabitSummary, Category } from '@/types'
import { HabitStatsRow } from './HabitStatsRow'

const HABIT_STATS_GRID_COLS = {
  xs: '1fr 70px 100px',
  sm: 'minmax(120px, 2fr) 80px 80px 80px 140px',
}

const COL_HABIT = 'Habit'
const COL_STREAK = 'Current'
const COL_LONGEST = 'Longest'
const COL_TOTAL = 'Total'
const COL_RATE = '7-day rate'

function getAvgRate(habits: HabitSummary[]): number {
  if (habits.length === 0) return 0
  const sum = habits.reduce((acc, h) => acc + h.weeklyCompletionRate, 0)
  return Math.round((sum / habits.length) * 100)
}

const HeaderRow: React.FC = () => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: HABIT_STATS_GRID_COLS,
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
      sx={{
        fontWeight: 600,
        textAlign: 'center',
        display: { xs: 'none', sm: 'block' },
      }}
    >
      {COL_LONGEST}
    </Typography>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{
        fontWeight: 600,
        textAlign: 'center',
        display: { xs: 'none', sm: 'block' },
      }}
    >
      {COL_TOTAL}
    </Typography>
    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
      {COL_RATE}
    </Typography>
  </Box>
)

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
        <Box sx={{ overflowX: 'auto' }}>
          <HeaderRow />
          {habits.map((h) => (
            <HabitStatsRow key={h.habitId} summary={h} />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

export default CategorySection
