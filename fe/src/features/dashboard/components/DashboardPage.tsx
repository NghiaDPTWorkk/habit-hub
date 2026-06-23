import React from 'react'
import Grid from '@mui/material/Grid'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { alpha } from '@mui/material/styles'
import { Box, Typography, Card, CalendarHeatmap, Stack } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { useDashboard, useDailyIntensity } from '../hooks'
import { KpiCard } from './KpiCard'
import { CategoryDistributionChart } from './CategoryDistributionChart'
import { CategorySection } from './CategorySection'
import { HABIT_STATS_GRID_COLS } from './habitStatsConfig'
import { formatPercent, getDateLabel } from '../utils'

const PAGE_TITLE = 'Dashboard'
const KPI_DONE_TITLE = '% Done Today'
const KPI_ACTIVE_TITLE = 'Active Habits'
const KPI_RISK_TITLE = 'At Risk'
const KPI_GOALS_TITLE = 'Goals Achieved'
const EMPTY_TITLE = 'No habits yet'
const EMPTY_DESC = 'Go to Habits and create your first habit to see stats here.'
const SECTION_ACTIVITY_TITLE = 'Activity History'
const TITLE_WEEKLY_STATS = 'Habit Overview'
const ICON_SIZE = { fontSize: 28 }
const HEATMAP_WEEKS = 14

const COL_HABIT = 'Habit'
const COL_STREAK = 'Current'
const COL_LONGEST = 'Longest'
const COL_TOTAL = 'Total'
const COL_RATE = '7-Day'

const LABEL_LESS = 'Less'
const LABEL_MORE = 'More'
const LABEL_WEEKS = 'Last 14 weeks'

const CARD_DONE = { iconColor: 'success.main', iconBg: 'rgba(39, 174, 96, 0.12)' }
const CARD_ACTIVE = { iconColor: 'info.main', iconBg: 'rgba(9, 105, 218, 0.12)' }
const CARD_RISK = { iconColor: 'secondary.main', iconBg: 'rgba(130, 80, 223, 0.12)' }
const CARD_GOALS = { iconColor: 'warning.main', iconBg: 'rgba(154, 103, 0, 0.12)' }

export const DashboardPage: React.FC = () => {
  const { summary, habitsByCategory } = useDashboard()
  const heatmapData = useDailyIntensity(HEATMAP_WEEKS * 7)
  const dateLabel = getDateLabel()
  const emptyMessage = `${EMPTY_TITLE}. ${EMPTY_DESC}`

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Title */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {PAGE_TITLE}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {dateLabel}
        </Typography>
      </Box>

      {/* Row 1: KPI cards */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            title={KPI_DONE_TITLE}
            value={formatPercent(summary.percentCompletedToday)}
            icon={<Icons.Check sx={ICON_SIZE} />}
            iconColor={CARD_DONE.iconColor}
            iconBg={CARD_DONE.iconBg}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            title={KPI_ACTIVE_TITLE}
            value={summary.activeHabits}
            icon={<Icons.TrendingUp sx={ICON_SIZE} />}
            iconColor={CARD_ACTIVE.iconColor}
            iconBg={CARD_ACTIVE.iconBg}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            title={KPI_RISK_TITLE}
            value={summary.atRiskHabits}
            icon={<Icons.WarningAmber sx={ICON_SIZE} />}
            iconColor={CARD_RISK.iconColor}
            iconBg={CARD_RISK.iconBg}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            title={KPI_GOALS_TITLE}
            value={summary.achievedGoals}
            icon={<Icons.EmojiEvents sx={ICON_SIZE} />}
            iconColor={CARD_GOALS.iconColor}
            iconBg={CARD_GOALS.iconBg}
          />
        </Grid>
      </Grid>

      {/* Row 2: Habit Overview — full width */}
      <Card sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          {TITLE_WEEKLY_STATS}
        </Typography>
        {habitsByCategory.length === 0 ? (
          <Box
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            {/* Table Header Row */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: HABIT_STATS_GRID_COLS,
                gap: 1,
                px: 2,
                py: 1.5,
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: (theme) => alpha(theme.palette.text.primary, 0.02),
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
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 600, textAlign: 'right' }}
              >
                {COL_RATE}
              </Typography>
            </Box>
            {/* Table Body - Empty Message */}
            <Box sx={{ py: 6, px: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {emptyMessage}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Stack spacing={2}>
            {habitsByCategory.map((group, index) => (
              <CategorySection
                key={group.category}
                category={group.category}
                habits={group.habits}
                defaultExpanded={index === 0}
              />
            ))}
          </Stack>
        )}
      </Card>

      {/* Row 3: Calendar Heatmap + Category Distribution */}
      <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
        {/* Activity History */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ p: { xs: 2, sm: 3 }, height: '100%' }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarMonthIcon sx={{ color: 'success.main' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {SECTION_ACTIVITY_TITLE}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                {LABEL_WEEKS}
              </Typography>
            </Box>

            {/* Heatmap with horizontal scroll on small screens */}
            <Box sx={{ overflowX: 'auto', pb: 1 }}>
              <CalendarHeatmap data={heatmapData} weeks={HEATMAP_WEEKS} showLabels />
            </Box>

            {/* Legend */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 0.75,
                mt: 1.5,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {LABEL_LESS}
              </Typography>
              <Box sx={{ width: 12, height: 12, bgcolor: 'divider', borderRadius: 0.5 }} />
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.3),
                  borderRadius: 0.5,
                }}
              />
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.6),
                  borderRadius: 0.5,
                }}
              />
              <Box sx={{ width: 12, height: 12, bgcolor: 'primary.main', borderRadius: 0.5 }} />
              <Typography variant="caption" color="text.secondary">
                {LABEL_MORE}
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Category Distribution */}
        <Grid size={{ xs: 12, md: 5 }}>
          <CategoryDistributionChart />
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardPage
