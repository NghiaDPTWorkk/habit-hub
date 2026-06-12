import React from 'react'
import Grid from '@mui/material/Grid'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { alpha } from '@mui/material/styles'
import { Box, Typography, Card, CalendarHeatmap } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { useDashboard, useDailyIntensity } from '../hooks'
import { KpiCard } from './KpiCard'
import { WeeklyHabitsStats } from './WeeklyHabitsStats'
import { WeeklyTrendChart } from './WeeklyTrendChart'
import { useBoundStore } from '@/store'
import { CategoryDistributionChart } from './CategoryDistributionChart'
import { ActivityDetails } from './ActivityDetails'

const PAGE_TITLE = 'Dashboard'
const KPI_DONE_TITLE = '% Done Today'
const KPI_ACTIVE_TITLE = 'Active Habits'
const KPI_RISK_TITLE = 'At Risk'
const KPI_GOALS_TITLE = 'Goals Achieved'
const EMPTY_TITLE = 'No habits yet'
const EMPTY_DESC = 'Go to Habits and create your first habit to see stats here.'
const SECTION_ACTIVITY_TITLE = 'Activity History'
const SECTION_ACTIVITY_DESC = 'Daily check-in activity map — click any cell to view details.'
const ICON_SIZE = { fontSize: 28 }
const HEATMAP_WEEKS = 14

const LABEL_LESS = 'Less'
const LABEL_MORE = 'More'
const LABEL_WEEKS = 'Last 14 weeks'

const CARD_DONE = { iconColor: 'success.main', iconBg: 'rgba(39, 174, 96, 0.12)' }
const CARD_ACTIVE = { iconColor: 'info.main', iconBg: 'rgba(9, 105, 218, 0.12)' }
const CARD_RISK = { iconColor: 'secondary.main', iconBg: 'rgba(130, 80, 223, 0.12)' }
const CARD_GOALS = { iconColor: 'warning.main', iconBg: 'rgba(154, 103, 0, 0.12)' }

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
  const dateLabel = getDateLabel()

  const checkins = useBoundStore((s) => s.checkins)
  const habits = useBoundStore((s) => s.habits)
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const [filterCategory, setFilterCategory] = React.useState<string>('All')

  const selectedDateDetails = React.useMemo(() => {
    if (!selectedDate) return null
    const dayCheckins = Object.values(checkins).filter(
      (c) => c.date === selectedDate && c.completedCount > 0
    )

    const completedTasks = dayCheckins.map((c) => {
      const habit = habits.find((h) => h.id === c.habitId)
      return {
        name: habit ? habit.name : `Habit #${c.habitId}`,
        category: habit ? habit.category : 'General',
        completedCount: c.completedCount,
        targetPerDay: habit ? habit.targetPerDay : 1,
      }
    })

    return {
      date: new Date(selectedDate).toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      count: completedTasks.length,
      tasks: completedTasks,
    }
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

      <Grid container spacing={3}>
        {/* Left column: Weekly Habits Statistics list */}
        <Grid size={{ xs: 12, md: 7 }}>
          {habitsByCategory.length === 0 ? (
            <Card
              sx={{
                textAlign: 'center',
                py: 6,
                height: '100%',
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
              <WeeklyHabitsStats
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
              />
              <WeeklyTrendChart filterCategory={filterCategory} />
            </Box>
          )}
        </Grid>

        {/* Right column: Charts */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
            <CategoryDistributionChart />
          </Box>
        </Grid>
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
