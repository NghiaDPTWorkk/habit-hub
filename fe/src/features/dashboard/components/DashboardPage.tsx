import React from 'react'
import Grid from '@mui/material/Grid'
import { Box, Typography } from '@/components/ui'
import { Card } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { useDashboard } from '../hooks'
import { KpiCard } from './KpiCard'
import { CategorySection } from './CategorySection'

const PAGE_TITLE = 'Dashboard'
const KPI_DONE_TITLE = '% Done Today'
const KPI_ACTIVE_TITLE = 'Active Habits'
const KPI_RISK_TITLE = 'At Risk'
const KPI_GOALS_TITLE = 'Goals Achieved'
const EMPTY_TITLE = 'No habits yet'
const EMPTY_DESC = 'Go to Habits and create your first habit to see stats here.'
const ICON_SIZE = { fontSize: 40 }

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

export const DashboardPage: React.FC = () => {
  const { summary, habitsByCategory } = useDashboard()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {PAGE_TITLE}
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            title={KPI_DONE_TITLE}
            value={formatPercent(summary.percentCompletedToday)}
            icon={<Icons.Check sx={ICON_SIZE} />}
            iconColor="success.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            title={KPI_ACTIVE_TITLE}
            value={summary.activeHabits}
            icon={<Icons.TrendingUp sx={ICON_SIZE} />}
            iconColor="primary.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            title={KPI_RISK_TITLE}
            value={summary.atRiskHabits}
            icon={<Icons.WarningAmber sx={ICON_SIZE} />}
            iconColor="warning.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            title={KPI_GOALS_TITLE}
            value={summary.achievedGoals}
            icon={<Icons.EmojiEvents sx={ICON_SIZE} />}
            iconColor="secondary.main"
          />
        </Grid>
      </Grid>

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
    </Box>
  )
}

export default DashboardPage
