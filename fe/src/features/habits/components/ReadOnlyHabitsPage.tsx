import React, { useMemo } from 'react'
import { Box, Typography, alpha } from '@/components/ui'
import { useHabitStore } from '@/features/habits/hooks'
import { useCheckinStore } from '@/features/checkins/hooks'
import { pxToRem } from '@/utils'
import { currentStreak, totalCompletions } from '@/features/dashboard/services'
import { ReadOnlyHabitsSummary } from './ReadOnlyHabitsSummary'

const PAGE_TEXTS = {
  title: '🏆 Achievement Showcase Hall',
  description:
    'A premium, gamified showcase of your current consistency, milestones, and habit completion stats.',
}

export const ReadOnlyHabitsPage: React.FC = () => {
  const { habits } = useHabitStore()
  const { today, checkinsByDate, checkins } = useCheckinStore()

  const activeHabits = useMemo(() => habits.filter((h) => h.status === 'Active'), [habits])

  const todayCheckinByHabit = useMemo(
    () =>
      (checkinsByDate[today] ?? []).reduce<Record<number, { completedCount: number }>>(
        (acc, checkin) => {
          acc[checkin.habitId] = { completedCount: checkin.completedCount }
          return acc
        },
        {}
      ),
    [checkinsByDate, today]
  )

  const checkinsList = useMemo(() => Object.values(checkins), [checkins])

  const completedTodayCount = useMemo(
    () =>
      activeHabits.filter((h) => {
        const checkin = todayCheckinByHabit[h.id]
        return checkin && checkin.completedCount >= h.targetPerDay
      }).length,
    [activeHabits, todayCheckinByHabit]
  )

  const completionRate = useMemo(
    () => (activeHabits.length > 0 ? (completedTodayCount / activeHabits.length) * 100 : 0),
    [completedTodayCount, activeHabits.length]
  )

  const highestStreak = useMemo(() => {
    if (activeHabits.length === 0) return 0
    return Math.max(...activeHabits.map((h) => currentStreak(h, checkinsList)), 0)
  }, [activeHabits, checkinsList])

  const totalCompletionsCount = useMemo(() => {
    return activeHabits.reduce((acc, h) => acc + totalCompletions(h, checkinsList), 0)
  }, [activeHabits, checkinsList])

  const focusCategory = useMemo(() => {
    if (activeHabits.length === 0) return 'None'
    const counts = activeHabits.reduce<Record<string, number>>((acc, h) => {
      acc[h.category] = (acc[h.category] ?? 0) + 1
      return acc
    }, {})
    return Object.entries(counts).reduce((a, b) => (a[1] > b[1] ? a : b))[0]
  }, [activeHabits])

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        maxWidth: pxToRem(1000),
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '10%',
          width: pxToRem(300),
          height: pxToRem(300),
          borderRadius: '50%',
          background: (t) =>
            `radial-gradient(circle, ${alpha(t.palette.success.main, 0.05)} 0%, ${alpha(t.palette.background.default, 0)} 70%)`,
          zIndex: -1,
          pointerEvents: 'none',
          filter: 'blur(40px)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: pxToRem(400),
          height: pxToRem(400),
          borderRadius: '50%',
          background: (t) =>
            `radial-gradient(circle, ${alpha(t.palette.primary.main, 0.04)} 0%, ${alpha(t.palette.background.default, 0)} 70%)`,
          zIndex: -1,
          pointerEvents: 'none',
          filter: 'blur(50px)',
        },
      }}
    >
      <Box>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 800,
            background: (t) =>
              `linear-gradient(45deg, ${t.palette.primary.main} 30%, ${t.palette.success.main} 90%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {PAGE_TEXTS.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {PAGE_TEXTS.description}
        </Typography>
      </Box>

      <ReadOnlyHabitsSummary
        activeHabits={activeHabits}
        todayCheckinByHabit={todayCheckinByHabit}
        completedTodayCount={completedTodayCount}
        completionRate={completionRate}
        highestStreak={highestStreak}
        totalCompletionsCount={totalCompletionsCount}
        focusCategory={focusCategory}
      />
    </Box>
  )
}
