import React from 'react'
import {
  Box,
  Card,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
} from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { useDashboard } from '../hooks'
import { pxToRem } from '@/utils'

const TITLE_WEEKLY_STATS = 'Weekly Habits Statistics'
const HEADER_NAME = 'Habit Name'
const HEADER_STREAK = 'Current'
const HEADER_LONGEST_STREAK = 'Longest'
const HEADER_TOTAL = 'Total'

const LABEL_FILTER_CATE = 'Category'

const CATE_ALL = 'All'
const CATE_HEALTH = 'Health'
const CATE_STUDY = 'Study'
const CATE_WORK = 'Work'
const CATE_MINDFULNESS = 'Mindfulness'
const CATE_OTHER = 'Other'
const BTN_RESET = 'Reset'

interface WeeklyHabitsStatsProps {
  filterCategory: string
  setFilterCategory: (category: string) => void
}

export const WeeklyHabitsStats: React.FC<WeeklyHabitsStatsProps> = ({
  filterCategory,
  setFilterCategory,
}) => {
  const { habitsByCategory } = useDashboard()

  const sortedHabits = React.useMemo(() => {
    const flatSummaries = habitsByCategory.flatMap((g) => g.habits)
    const filtered =
      filterCategory === 'All'
        ? flatSummaries
        : flatSummaries.filter((h) => h.category === filterCategory)

    return filtered.sort((a, b) => b.habitId - a.habitId).slice(0, 4)
  }, [habitsByCategory, filterCategory])

  return (
    <Card sx={{ p: { xs: 2, sm: 3 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 3 }}>
        <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700 }}>
          {TITLE_WEEKLY_STATS}
        </Typography>
      </Box>

      {/* Filter controls */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: pxToRem(120) }}>
          <InputLabel id="category-filter-label">{LABEL_FILTER_CATE}</InputLabel>
          <Select
            labelId="category-filter-label"
            value={filterCategory}
            label={LABEL_FILTER_CATE}
            onChange={(e) => setFilterCategory(e.target.value as string)}
          >
            <MenuItem value="All">{CATE_ALL}</MenuItem>
            <MenuItem value="Health">{CATE_HEALTH}</MenuItem>
            <MenuItem value="Study">{CATE_STUDY}</MenuItem>
            <MenuItem value="Work">{CATE_WORK}</MenuItem>
            <MenuItem value="Mindfulness">{CATE_MINDFULNESS}</MenuItem>
            <MenuItem value="Other">{CATE_OTHER}</MenuItem>
          </Select>
        </FormControl>
        {filterCategory !== 'All' && (
          <Button variant="text" size="small" onClick={() => setFilterCategory('All')}>
            {BTN_RESET}
          </Button>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {/* Table Header */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'minmax(' + pxToRem(100) + ', 2.5fr) 1.2fr 1.2fr 1fr',
              sm: 'minmax(' + pxToRem(150) + ', 3fr) 1.2fr 1.2fr 1fr',
            },
            gap: 1,
            pb: 1,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            {HEADER_NAME}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            {HEADER_STREAK}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            {HEADER_LONGEST_STREAK}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            {HEADER_TOTAL}
          </Typography>
        </Box>

        {/* Table Body */}
        {sortedHabits.map((item) => {
          const streakText = `${item.currentStreak}d`
          const longestStreakText = `${item.longestStreak}d`

          return (
            <Box
              key={item.habitId}
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'minmax(' + pxToRem(100) + ', 2.5fr) 1.2fr 1.2fr 1fr',
                  sm: 'minmax(' + pxToRem(150) + ', 3fr) 1.2fr 1.2fr 1fr',
                },
                gap: 1,
                alignItems: 'center',
                py: 1,
                borderBottom: 1,
                borderColor: 'divider',
                '&:last-child': { borderBottom: 0 },
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {item.habitName}
              </Typography>

              {/* Current Streak Column */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ color: 'warning.main', display: 'flex' }}>
                  <Icons.Whatshot fontSize="small" />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {streakText}
                </Typography>
              </Box>

              {/* Longest Streak Column */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Box sx={{ color: 'success.main', display: 'flex' }}>
                  <Icons.TrendingUp fontSize="small" />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {longestStreakText}
                </Typography>
              </Box>

              {/* Total Completions Column */}
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {item.totalCompletions}
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Card>
  )
}

export default WeeklyHabitsStats
