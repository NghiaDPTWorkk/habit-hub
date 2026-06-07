import { useMemo } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { EmptyState } from '@/components/ui/EmptyState'
import { KPICard } from '../components/KPICard'
import { AtRiskBanner } from '../components/AtRiskBanner'
import { CategorySection } from '../components/CategorySection'
import { getDashboard } from '@/services/StatsService'
import { useBoundStore } from '@/store/useBoundStore'
import {
  LocalFireDepartmentIcon,
  ChecklistIcon,
  WarningAmberIcon,
  EmojiEventsIcon,
} from '@/components/ui/icons'
import { useNavigate } from 'react-router-dom'

const PAGE_TITLE = 'Dashboard'
const CATEGORY_SECTION_TITLE = 'Habits by category'
const COL_HABIT = 'HABIT'
const COL_STREAK = 'STREAK'
const COL_BEST = 'BEST'
const COL_TOTAL = 'TOTAL'
const COL_7DAYS = '7 DAYS'

export function DashboardPage() {
  const navigate = useNavigate()
  const habits = useBoundStore((s) => s.habits)
  const checkIns = useBoundStore((s) => s.checkIns)
  const goals = useBoundStore((s) => s.goals)

  const dashboard = useMemo(() => getDashboard(habits, checkIns, goals), [habits, checkIns, goals])

  const { summary, habitsByCategory } = dashboard
  const pctDone = Math.round(summary.percentCompletedToday * 100)

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        {PAGE_TITLE}
      </Typography>

      <AtRiskBanner count={summary.atRiskHabits} />

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <KPICard
            label="Done today"
            value={`${pctDone}%`}
            icon={ChecklistIcon}
            color="primary.main"
            subtitle={`${summary.checkInsThisWeek} this week`}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <KPICard
            label="Active habits"
            value={summary.activeHabits}
            icon={LocalFireDepartmentIcon}
            color="secondary.main"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <KPICard
            label="At risk"
            value={summary.atRiskHabits}
            icon={WarningAmberIcon}
            color={summary.atRiskHabits > 0 ? 'warning.main' : 'text.secondary'}
            subtitle={summary.atRiskHabits > 0 ? 'Need check-in today' : 'All good!'}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <KPICard
            label="Goals achieved"
            value={summary.achievedGoals}
            icon={EmojiEventsIcon}
            color="primary.main"
          />
        </Grid>
      </Grid>

      {summary.activeHabits === 0 && (
        <EmptyState
          title="No habits yet"
          description="Create your first habit to start tracking progress."
          actionLabel="Go to Habits"
          onAction={() => navigate('/habits')}
        />
      )}

      {habitsByCategory.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            {CATEGORY_SECTION_TITLE}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              px: 3,
              pb: 1,
              borderBottom: '1px solid',
              borderColor: 'divider',
              mb: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: 'text.secondary', flexGrow: 1 }}
            >
              {COL_HABIT}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: 'text.secondary', width: 60 }}
            >
              {COL_STREAK}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: 'text.secondary', width: 60 }}
            >
              {COL_BEST}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: 'text.secondary', width: 50 }}
            >
              {COL_TOTAL}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: 'text.secondary', width: 48, textAlign: 'right' }}
            >
              {COL_7DAYS}
            </Typography>
          </Box>

          {habitsByCategory.map((group, i) => (
            <CategorySection
              key={group.category}
              category={group.category}
              habits={group.habits}
              defaultExpanded={i === 0}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}
