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
import { useBoundStore } from '@/store'
import { pxToRem } from '@/utils'

const TITLE_WEEKLY_STATS = 'Weekly Habits Statistics'
const TITLE_SORTED_PRIORITY = 'Sorted by Priority'
const HEADER_NAME = 'Habit Name'
const HEADER_PRIORITY = 'Priority'
const HEADER_STREAK = 'Current'
const HEADER_LONGEST_STREAK = 'Longest'

const LABEL_FILTER_CATE = 'Category'

const CATE_ALL = 'All'
const CATE_HEALTH = 'Health'
const CATE_STUDY = 'Study'
const CATE_WORK = 'Work'
const CATE_MINDFULNESS = 'Mindfulness'
const CATE_OTHER = 'Other'
const BTN_RESET = 'Reset'

const PRIORITY_ORDER = { High: 3, Medium: 2, Low: 1 }

export const WeeklyHabitsStats: React.FC = () => {
  const { habitsByCategory } = useDashboard()
  const habits = useBoundStore((s) => s.habits)

  const [filterCategory, setFilterCategory] = React.useState<string>('All')

  const sortedHabits = React.useMemo(() => {
    const flatSummaries = habitsByCategory.flatMap((g) => g.habits)
    const filtered =
      filterCategory === 'All'
        ? flatSummaries
        : flatSummaries.filter((h) => h.category === filterCategory)

    return filtered.sort((a, b) => {
      const pA = habits.find((h) => h.id === a.habitId)?.priority || 'Medium'
      const pB = habits.find((h) => h.id === b.habitId)?.priority || 'Medium'
      return PRIORITY_ORDER[pB] - PRIORITY_ORDER[pA]
    })
  }, [habitsByCategory, habits, filterCategory])

  return (
    <Card sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {TITLE_WEEKLY_STATS}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {TITLE_SORTED_PRIORITY}
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
              xs: '1fr ' + pxToRem(100),
              sm: 'minmax(' + pxToRem(150) + ', 3fr) 1fr 1fr 1fr',
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
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 600, display: { xs: 'none', sm: 'block' } }}
          >
            {HEADER_PRIORITY}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            {HEADER_STREAK}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 600, display: { xs: 'none', sm: 'block' } }}
          >
            {HEADER_LONGEST_STREAK}
          </Typography>
        </Box>

        {/* Table Body */}
        {sortedHabits.map((item) => {
          const detail = habits.find((h) => h.id === item.habitId)
          const priority = detail ? detail.priority : 'Medium'
          const streakText = `${item.currentStreak}d`
          const longestStreakText = `${item.longestStreak}d`

          return (
            <Box
              key={item.habitId}
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr ' + pxToRem(100),
                  sm: 'minmax(' + pxToRem(150) + ', 3fr) 1fr 1fr 1fr',
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

              {/* Priority Column */}
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Box
                  sx={{
                    display: 'inline-block',
                    px: 1.25,
                    py: 0.5,
                    borderRadius: 0.5,
                    bgcolor: 'action.hover',
                    color: 'text.secondary',
                    fontSize: pxToRem(12),
                    fontWeight: 600,
                  }}
                >
                  {priority}
                </Box>
              </Box>

              {/* Streak Column */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ color: 'warning.main', display: 'flex' }}>
                  <Icons.Whatshot fontSize="small" />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {streakText}
                </Typography>
              </Box>

              {/* Longest Streak Column */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 500 }}
              >
                {longestStreakText}
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Card>
  )
}

export default WeeklyHabitsStats
