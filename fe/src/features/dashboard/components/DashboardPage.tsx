import React from 'react'
import Grid from '@mui/material/Grid'
import { Box, Typography } from '@/components/ui'
import { Card } from '@/components/ui'
import { CalendarHeatmap } from '@/components/ui'
import { MiniChart } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { useDashboard, useDailyIntensity, useWeeklyRates } from '../hooks'
import { KpiCard } from './KpiCard'
import { CategorySection } from './CategorySection'

const PAGE_TITLE = 'Dashboard'
const KPI_DONE_TITLE = '% Done Today'
const KPI_ACTIVE_TITLE = 'Active Habits'
const KPI_RISK_TITLE = 'At Risk'
const KPI_GOALS_TITLE = 'Goals Achieved'
const SECTION_WEEKLY = 'Weekly by Category'
const SECTION_ACTIVITY = 'Activity — last 16 weeks'
const EMPTY_TITLE = 'No habits yet'
const EMPTY_DESC = 'Go to Habits and create your first habit to see stats here.'
const ICON_SIZE = { fontSize: 40 }
const HEATMAP_WEEKS = 16

const CARD_DONE = { iconColor: 'success.main', iconBg: 'rgba(16,185,129,0.12)' }
const CARD_ACTIVE = { iconColor: 'primary.main', iconBg: 'rgba(140,122,230,0.12)' }
const CARD_RISK = { iconColor: 'warning.main', iconBg: 'rgba(245,158,11,0.12)' }
const CARD_GOALS = { iconColor: 'secondary.main', iconBg: 'rgba(113,128,147,0.12)' }

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

function getDateLabel(): string {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export const DashboardPage: React.FC = () => {
  const { summary, habitsByCategory } = useDashboard()
  const heatmapData = useDailyIntensity(HEATMAP_WEEKS * 7)
  const weeklyRates = useWeeklyRates()
  const dateLabel = getDateLabel()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {PAGE_TITLE}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {dateLabel}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            title={KPI_DONE_TITLE}
            value={formatPercent(summary.percentCompletedToday)}
            icon={<Icons.Check sx={ICON_SIZE} />}
            {...CARD_DONE}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            title={KPI_ACTIVE_TITLE}
            value={summary.activeHabits}
            icon={<Icons.TrendingUp sx={ICON_SIZE} />}
            {...CARD_ACTIVE}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            title={KPI_RISK_TITLE}
            value={summary.atRiskHabits}
            icon={<Icons.WarningAmber sx={ICON_SIZE} />}
            {...CARD_RISK}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            title={KPI_GOALS_TITLE}
            value={summary.achievedGoals}
            icon={<Icons.EmojiEvents sx={ICON_SIZE} />}
            {...CARD_GOALS}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {weeklyRates.length > 0 && (
              <Card sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  {SECTION_WEEKLY}
                </Typography>
                <MiniChart data={weeklyRates} />
              </Card>
            )}
            <Card sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                {SECTION_ACTIVITY}
              </Typography>
              <CalendarHeatmap data={heatmapData} weeks={HEATMAP_WEEKS} />
            </Card>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          {habitsByCategory.length === 0 ? (
            <Card sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                {EMPTY_TITLE}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {EMPTY_DESC}
              </Typography>
            </Card>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {habitsByCategory.map((group, idx) => (
                <CategorySection
                  key={group.category}
                  category={group.category}
                  habits={group.habits}
                  defaultExpanded={idx === 0}
                />
              ))}
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardPage
