import React, { useMemo, useState } from 'react'
import {
  Box,
  Typography,
  ProgressBar,
  alpha,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { pxToRem } from '@/utils'
import type { Habit } from '@/types'
import { BadgeBox, StatBox, ProclamationHabitList } from './ReadOnlyHabitsSummaryBoxes'
import { SUMMARY_TEXTS } from './ReadOnlyHabitsSummaryTexts'

export interface ReadOnlyHabitsSummaryProps {
  activeHabits: Habit[]
  todayCheckinByHabit: Record<number, { completedCount: number }>
  completedTodayCount: number
  completionRate: number
  highestStreak: number
  totalCompletionsCount: number
  focusCategory: string
}

export const ReadOnlyHabitsSummary: React.FC<ReadOnlyHabitsSummaryProps> = ({
  activeHabits,
  todayCheckinByHabit,
  completedTodayCount,
  completionRate,
  highestStreak,
  totalCompletionsCount,
  focusCategory,
}) => {
  const [expanded, setExpanded] = useState<boolean>(true)

  const activeCount = useMemo(() => activeHabits.length, [activeHabits])

  const levelData = useMemo(() => {
    const rate = completionRate
    if (rate <= 20) {
      return { level: 1, name: SUMMARY_TEXTS.levelNames[1], hint: SUMMARY_TEXTS.levelHints[1] }
    }
    if (rate <= 50) {
      return { level: 2, name: SUMMARY_TEXTS.levelNames[2], hint: SUMMARY_TEXTS.levelHints[2] }
    }
    if (rate <= 80) {
      return { level: 3, name: SUMMARY_TEXTS.levelNames[3], hint: SUMMARY_TEXTS.levelHints[3] }
    }
    if (rate < 100) {
      return { level: 4, name: SUMMARY_TEXTS.levelNames[4], hint: SUMMARY_TEXTS.levelHints[4] }
    }
    return { level: 5, name: SUMMARY_TEXTS.levelNames[5], hint: SUMMARY_TEXTS.levelHints[5] }
  }, [completionRate])

  const badge1DescText = SUMMARY_TEXTS.badges.dailyDesc(completedTodayCount, activeCount)
  const badge2DescText = SUMMARY_TEXTS.badges.streakDesc(highestStreak)
  const badge3DescText = SUMMARY_TEXTS.badges.focusDesc(focusCategory)
  const rateText = SUMMARY_TEXTS.rateLabel(completionRate)
  const statRateValue = `${completionRate.toFixed(0)}%`

  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{
        borderRadius: pxToRem(16),
        boxShadow: (t) => `0px 10px 30px ${alpha(t.palette.primary.main, 0.08)}`,
        border: '1px solid',
        borderColor: (t) => alpha(t.palette.primary.main, 0.1),
        bgcolor: 'background.paper',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:before': { display: 'none' },
        '&.Mui-expanded': {
          boxShadow: (t) => `0px 15px 35px ${alpha(t.palette.primary.main, 0.15)}`,
          m: 0,
        },
        overflow: 'hidden',
      }}
    >
      <AccordionSummary
        expandIcon={<Icons.ExpandMore sx={{ color: 'primary.main' }} />}
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
          background: (t) =>
            t.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${alpha(t.palette.primary.main, 0.08)} 0%, ${alpha(t.palette.background.paper, 0.95)} 100%)`
              : `linear-gradient(135deg, ${alpha(t.palette.primary.main, 0.03)} 0%, ${alpha(t.palette.background.paper, 0.95)} 100%)`,
          borderBottom: expanded ? '1px solid' : '1px solid transparent',
          borderColor: 'divider',
          '&.Mui-expanded': {
            borderColor: 'divider',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            mr: 2,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: pxToRem(40),
                height: pxToRem(40),
                borderRadius: '50%',
                bgcolor: (t) => alpha(t.palette.warning.main, 0.15),
                boxShadow: (t) => `0 0 12px ${alpha(t.palette.warning.main, 0.2)}`,
              }}
            >
              <Icons.EmojiEvents sx={{ color: 'warning.main', fontSize: pxToRem(24) }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary' }}>
                {SUMMARY_TEXTS.headerTitle}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {SUMMARY_TEXTS.levelLabel(levelData.level, levelData.name)}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: (t) => alpha(t.palette.success.main, 0.08),
                border: '1px solid',
                borderColor: (t) => alpha(t.palette.success.main, 0.2),
                borderRadius: pxToRem(20),
                px: 2,
                py: 0.5,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 800, color: 'success.main' }}>
                {rateText}
              </Typography>
            </Box>
          </Box>
        </Box>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          p: { xs: 2, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 3, sm: 4 },
          bgcolor: (t) => alpha(t.palette.background.default, 0.4),
        }}
      >
        {/* Quote Block Proclamation */}
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: pxToRem(12),
            borderLeft: pxToRem(4) + ' solid',
            borderLeftColor: 'primary.main',
            bgcolor: (t) => alpha(t.palette.primary.main, 0.03),
            boxShadow: (t) => `inset 0 0 10px ${alpha(t.palette.primary.main, 0.02)}`,
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: 'text.primary', lineHeight: 1.8, fontSize: pxToRem(15) }}
          >
            {SUMMARY_TEXTS.proclamation.prefix}
            <strong>{activeCount}</strong>
            {SUMMARY_TEXTS.proclamation.activeText}
            <strong>{completedTodayCount}</strong>
            {SUMMARY_TEXTS.proclamation.outOfText}
            <strong>{activeCount}</strong>
            {SUMMARY_TEXTS.proclamation.completedText}
            <strong>{completionRate.toFixed(0)}</strong>
            {SUMMARY_TEXTS.proclamation.suffixText}
          </Typography>

          <ProclamationHabitList
            activeHabits={activeHabits}
            todayCheckinByHabit={todayCheckinByHabit}
          />
        </Box>

        {/* Gamified Level Progress Bar */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 3,
            borderRadius: pxToRem(16),
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 800,
                color: 'text.primary',
                textTransform: 'uppercase',
                fontSize: pxToRem(12),
              }}
            >
              {SUMMARY_TEXTS.levelLabel(levelData.level, levelData.name)}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {levelData.hint}
            </Typography>
          </Box>
          <ProgressBar value={completionRate} color="success" height={10} showLabel={true} />
        </Box>

        {/* Badges Grid */}
        <Box
          sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' } }}
        >
          <BadgeBox
            icon={<Icons.EmojiEvents sx={{ color: 'warning.main', fontSize: pxToRem(32) }} />}
            title={SUMMARY_TEXTS.badges.dailyTitle}
            desc={badge1DescText}
            color="success"
          />
          <BadgeBox
            icon={<Icons.Whatshot sx={{ color: 'error.main', fontSize: pxToRem(32) }} />}
            title={SUMMARY_TEXTS.badges.streakTitle}
            desc={badge2DescText}
            color="warning"
          />
          <BadgeBox
            icon={<Icons.TrendingUp sx={{ color: 'primary.main', fontSize: pxToRem(32) }} />}
            title={SUMMARY_TEXTS.badges.focusTitle}
            desc={badge3DescText}
            color="primary"
          />
        </Box>

        {/* All-time stats grid */}
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 1.5, sm: 2.5 },
            gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' },
            mt: 1,
          }}
        >
          <StatBox
            label={SUMMARY_TEXTS.stats.activeHabits}
            value={activeCount}
            icon={<Icons.Check sx={{ fontSize: pxToRem(20) }} />}
            color="primary.main"
          />
          <StatBox
            label={SUMMARY_TEXTS.stats.todayRate}
            value={statRateValue}
            icon={<Icons.TrendingUp sx={{ fontSize: pxToRem(20) }} />}
            color="success.main"
          />
          <StatBox
            label={SUMMARY_TEXTS.stats.totalCheckins}
            value={SUMMARY_TEXTS.stats.checkinsValue(totalCompletionsCount)}
            icon={<Icons.EmojiEvents sx={{ fontSize: pxToRem(20) }} />}
            color="warning.main"
          />
          <StatBox
            label={SUMMARY_TEXTS.stats.topStreak}
            value={SUMMARY_TEXTS.stats.streakValue(highestStreak)}
            icon={<Icons.Whatshot sx={{ fontSize: pxToRem(20) }} />}
            color="error.main"
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}
