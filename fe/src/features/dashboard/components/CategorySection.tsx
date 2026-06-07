import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { alpha } from '@mui/material/styles'
import { LocalFireDepartmentIcon, TrendingUpIcon, EmojiEventsIcon } from '@/components/ui/icons'
import type { HabitSummary, Category } from '@/types'
import { CATEGORY_LABELS } from '@/types'
import { CATEGORY_COLORS, CATEGORY_BG } from '@/theme'

interface Props {
  category: Category
  habits: HabitSummary[]
  defaultExpanded?: boolean
}

export function CategorySection({ category, habits, defaultExpanded }: Props) {
  const color = CATEGORY_COLORS[category]
  const bg = CATEGORY_BG[category]

  return (
    <Accordion
      defaultExpanded={defaultExpanded ?? false}
      disableGutters
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '10px !important',
        mb: 2,
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {CATEGORY_LABELS[category]}
          </Typography>
          <Chip
            label={habits.length}
            size="small"
            sx={{ bgcolor: bg, color, fontWeight: 700, height: 20, fontSize: 11 }}
          />
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ p: 0 }}>
        {habits.map((summary) => (
          <HabitStatRow key={summary.habit.id} summary={summary} />
        ))}
      </AccordionDetails>
    </Accordion>
  )
}

function HabitStatRow({ summary }: { summary: HabitSummary }) {
  const {
    habit,
    currentStreak,
    longestStreak,
    totalCompletions,
    weeklyCompletionRate,
    isAtRisk,
    todayCompleted,
  } = summary

  const streakLabel = `${currentStreak}d`
  const longestLabel = `${longestStreak}d`
  const rateLabel = `${Math.round(weeklyCompletionRate * 100)}%`

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: 3,
        py: 1.5,
        borderTop: '1px solid',
        borderColor: 'divider',
        ...(isAtRisk &&
          !todayCompleted && {
            bgcolor: (theme) => alpha(theme.palette.warning.main, 0.07),
            borderLeft: '3px solid',
            borderLeftColor: 'warning.main',
          }),
      }}
    >
      <Typography variant="body2" noWrap sx={{ fontWeight: 600, flexGrow: 1, minWidth: 120 }}>
        {habit.name}
      </Typography>

      <Tooltip title="Current streak">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: 60 }}>
          <LocalFireDepartmentIcon
            sx={{ fontSize: 14, color: currentStreak > 0 ? 'warning.main' : 'text.disabled' }}
          />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: currentStreak > 0 ? 'text.primary' : 'text.disabled',
            }}
          >
            {streakLabel}
          </Typography>
        </Box>
      </Tooltip>

      <Tooltip title="Longest streak">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: 60 }}>
          <EmojiEventsIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {longestLabel}
          </Typography>
        </Box>
      </Tooltip>

      <Tooltip title="Total completions">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: 50 }}>
          <TrendingUpIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {totalCompletions}
          </Typography>
        </Box>
      </Tooltip>

      <Tooltip title="Completion rate (last 7 days)">
        <Box sx={{ width: 48, textAlign: 'right' }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color:
                weeklyCompletionRate >= 0.8
                  ? 'success.main'
                  : weeklyCompletionRate >= 0.5
                    ? 'warning.main'
                    : 'error.main',
            }}
          >
            {rateLabel}
          </Typography>
        </Box>
      </Tooltip>
    </Box>
  )
}
