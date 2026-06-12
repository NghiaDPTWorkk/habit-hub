import React from 'react'
import Grid from '@mui/material/Grid'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { alpha } from '@mui/material/styles'
import { Box, Typography, Card, CalendarHeatmap, Stack } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { useDashboard, useDailyIntensity } from '../hooks'
import { KpiCard } from './KpiCard'
import { WeeklyTrendChart } from './WeeklyTrendChart'
import { useBoundStore } from '@/store'
import { CategoryDistributionChart } from './CategoryDistributionChart'
import { ActivityDetails } from './ActivityDetails'
import { CategorySection } from './CategorySection'
import { formatPercent, getDateLabel, getSelectedDateDetails } from '../utils'

const PAGE_TITLE = 'Dashboard'
const KPI_DONE_TITLE = '% Done Today'
const KPI_ACTIVE_TITLE = 'Active Habits'
const KPI_RISK_TITLE = 'At Risk'
const KPI_GOALS_TITLE = 'Goals Achieved'
const EMPTY_TITLE = 'No habits yet'
const EMPTY_DESC = 'Go to Habits and create your first habit to see stats here.'
const SECTION_ACTIVITY_TITLE = 'Activity History'
const SECTION_ACTIVITY_DESC = 'Daily check-in activity map — click any cell to view details.'
const TITLE_WEEKLY_STATS = 'Weekly Habits Statistics'
const ICON_SIZE = { fontSize: 28 }
const HEATMAP_WEEKS = 14

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

  const checkins = useBoundStore((s) => s.checkins)
  const habits = useBoundStore((s) => s.habits)
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)

  const selectedDateDetails = React.useMemo(() => {
    return getSelectedDateDetails(selectedDate, checkins, habits)
  }, [selectedDate, checkins, habits])

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

      <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
        {/* Left column: Weekly Habits Statistics list */}
        <Grid size={{ xs: 12, md: 7 }} sx={{ display: 'flex', flexDirection: 'column' }}>
          {habitsByCategory.length === 0 ? (
            <Card
              sx={{
                textAlign: 'center',
                py: 6,
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                {EMPTY_TITLE}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {EMPTY_DESC}
              </Typography>
            </Card>
          ) : (
            <Card
              sx={{ p: { xs: 2, sm: 3 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {TITLE_WEEKLY_STATS}
                  </Typography>
                </Box>

                <Stack spacing={2} sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: 380, pr: 0.5 }}>
                  {habitsByCategory.map((group, index) => (
                    <CategorySection
                      key={group.category}
                      category={group.category}
                      habits={group.habits}
                      defaultExpanded={index === 0}
                    />
                  ))}
                </Stack>
              </Box>
            </Card>
          )}
        </Grid>

        {/* Right column: Charts */}
        <Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex', flexDirection: 'column' }}>
          <CategoryDistributionChart />
        </Grid>

        {/* Row 2: Full width Weekly Trend Chart */}
        {habitsByCategory.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <WeeklyTrendChart />
          </Grid>
        )}
      </Grid>

      {/* Activity History block at the bottom */}
      <Card sx={{ p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 0.5,
          }}
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
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {SECTION_ACTIVITY_DESC}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            alignItems: 'flex-start',
            width: '100%',
            minWidth: 0,
          }}
        >
          {/* Heatmap Section */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              width: { xs: '100%', md: 'auto' },
              maxWidth: '100%',
              minWidth: 0,
              flexShrink: 0,
            }}
          >
            {/* Scrollable wrapper for heatmap grid */}
            <Box sx={{ overflowX: 'auto', pb: 1, width: '100%', maxWidth: '100%' }}>
              <Box sx={{ width: 'fit-content' }}>
                <CalendarHeatmap
                  data={heatmapData}
                  weeks={HEATMAP_WEEKS}
                  onCellClick={setSelectedDate}
                  activeDate={selectedDate}
                />
              </Box>
            </Box>
            {/* Legend - aligned right relative to the heatmap */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                justifyContent: 'flex-end',
                width: '100%',
                maxWidth: 276,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {LABEL_LESS}
              </Typography>
              <Box sx={{ width: 14, height: 14, bgcolor: 'divider', borderRadius: 0.5 }} />
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.3),
                  borderRadius: 0.5,
                }}
              />
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.6),
                  borderRadius: 0.5,
                }}
              />
              <Box sx={{ width: 14, height: 14, bgcolor: 'primary.main', borderRadius: 0.5 }} />
              <Typography variant="caption" color="text.secondary">
                {LABEL_MORE}
              </Typography>
            </Box>
          </Box>

          {/* Details Section */}
          <Box sx={{ flexGrow: 1, width: '100%', minWidth: { xs: '100%', md: 320 } }}>
            <ActivityDetails details={selectedDateDetails} />
          </Box>
        </Box>
      </Card>
    </Box>
  )
}

export default DashboardPage
