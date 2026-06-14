import React, { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import dayjs, { type Dayjs } from 'dayjs'
import { Box, Typography, Button, Card, ProgressBar, alpha } from '@/components/ui'
import { pxToRem } from '@/utils'
import { useBoundStore } from '@/store'
import { useCheckinStore } from '../hooks'
import { CHECKIN_CONTENT } from '../constants'
import type { Habit } from '@/types'
import { CheckinItemCard } from './CheckinItemCard'
import { MultiCountModal } from './MultiCountModal'
import { getDayStatus, getActiveHabitsForDay } from '../utils'
import { isAtRisk } from '@/features/dashboard/services'
import { MonthlyCalendar } from './MonthlyCalendar'

const VARIANT_BODY1 = 'body1'
const COLOR_TEXT_SECONDARY = 'text.secondary'
const LOGS_HEADER = 'Check-in Logs'
const BTN_SHOW_PICKER = 'Show Monthly Calendar'
const BTN_HIDE_PICKER = 'Hide Monthly Calendar'
const DAILY_PROGRESS_LABEL = 'Daily Progress'
const PROGRESS_FOR_LABEL = 'Progress for '
const PROGRESS_SUBTITLE =
  'Shows habits scheduled for this date. 100% completed days are indicated by a green dot marker.'
const WEEK_DAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

export const CheckinsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [modalHabit, setModalHabit] = useState<Habit | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const { getCheckinByHabitAndDate, checkins } = useCheckinStore()
  const habits = useBoundStore((state) => state.habits)

  const selectedDate = useMemo(() => {
    const dateParam = searchParams.get('date')
    return dateParam ? dayjs(dateParam) : dayjs()
  }, [searchParams])

  const dateStr = selectedDate.format('YYYY-MM-DD')

  const setSelectedDate = (v: Dayjs) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set('date', v.format('YYYY-MM-DD'))
        return next
      },
      { replace: true }
    )
  }

  const activeHabits = useMemo(() => {
    return getActiveHabitsForDay(habits, selectedDate)
  }, [habits, selectedDate])

  const isToday = dateStr === dayjs().format('YYYY-MM-DD')

  const atRiskIds = useMemo(() => {
    if (!isToday) return new Set<number>()
    const arr = Object.values(checkins)
    return new Set(activeHabits.filter((h) => isAtRisk(h, arr)).map((h) => h.id))
  }, [activeHabits, checkins, isToday])

  const sortedHabits = useMemo(() => {
    if (!isToday) return activeHabits
    return [...activeHabits].sort((a, b) => {
      const rank = (h: typeof a): number => {
        if (getCheckinByHabitAndDate(h.id, dateStr)?.status === 'Completed') return 2
        return atRiskIds.has(h.id) ? 0 : 1
      }
      return rank(a) - rank(b)
    })
  }, [activeHabits, atRiskIds, isToday, getCheckinByHabitAndDate, dateStr])

  const weekDays = useMemo(() => {
    const start =
      selectedDate.day() === 0
        ? selectedDate.subtract(6, 'day')
        : selectedDate.subtract(selectedDate.day() - 1, 'day')
    return Array.from({ length: 7 }, (_, i) => start.add(i, 'day'))
  }, [selectedDate])

  const { completedCount, totalCount, progressPercent } = useMemo(() => {
    const total = activeHabits.length
    if (total === 0) return { completedCount: 0, totalCount: 0, progressPercent: 0 }
    const completed = activeHabits.filter((h) => {
      const c = getCheckinByHabitAndDate(h.id, dateStr)
      return c && c.completedCount >= h.targetPerDay
    }).length
    return {
      completedCount: completed,
      totalCount: total,
      progressPercent: Math.round((completed / total) * 100),
    }
  }, [activeHabits, getCheckinByHabitAndDate, dateStr])

  const habitsCompletedText = `${completedCount} / ${totalCount} habits completed`
  const progressForDateText = `${PROGRESS_FOR_LABEL}${dateStr}`
  const progressPercentText = `${progressPercent}%`

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {LOGS_HEADER}
        </Typography>
        <Button variant="outlined" size="small" onClick={() => setShowDatePicker((prev) => !prev)}>
          {showDatePicker ? BTN_HIDE_PICKER : BTN_SHOW_PICKER}
        </Button>
      </Box>

      {showDatePicker && (
        <Card sx={{ p: 2 }}>
          <MonthlyCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            habits={habits}
            getCheckinByHabitAndDate={getCheckinByHabitAndDate}
          />
        </Card>
      )}

      <Card sx={{ p: { xs: 1, sm: 2 } }}>
        <Box
          sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: { xs: 0.5, sm: 1 } }}
        >
          {weekDays.map((day, idx) => {
            const isFuture = day.isAfter(dayjs(), 'day')
            const isSelected = !isFuture && day.isSame(selectedDate, 'day')
            const dateNum = day.date()
            const label = WEEK_DAY_LABELS[idx]
            const status = getDayStatus(day, habits, getCheckinByHabitAndDate)

            return (
              <Box
                key={idx}
                onClick={() => {
                  if (!isFuture) {
                    setSelectedDate(day)
                  }
                }}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pt: { xs: 1, sm: 1.5 },
                  pb: { xs: 0.75, sm: 1.25 },
                  borderRadius: 1.5,
                  border: '1px solid',
                  borderColor: isSelected ? 'success.main' : 'transparent',
                  backgroundColor: isSelected
                    ? (theme) => alpha(theme.palette.success.main, 0.04)
                    : 'transparent',
                  cursor: isFuture ? 'default' : 'pointer',
                  userSelect: 'none',
                  opacity: isFuture ? 0.5 : 1,
                  transition: 'all 0.2s',
                  '&:hover': isFuture
                    ? {}
                    : {
                        borderColor: isSelected ? 'success.main' : 'divider',
                        backgroundColor: isSelected
                          ? (theme) => alpha(theme.palette.success.main, 0.04)
                          : 'action.hover',
                      },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: isSelected ? 'success.main' : 'text.secondary',
                    fontSize: { xs: pxToRem(10), sm: pxToRem(12) },
                    mb: 0.25,
                  }}
                >
                  {label}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 700,
                    color: isSelected
                      ? 'success.main'
                      : isFuture
                        ? 'text.secondary'
                        : 'text.primary',
                    fontSize: { xs: pxToRem(14), sm: pxToRem(16) },
                    mb: 0.5,
                  }}
                >
                  {dateNum}
                </Typography>
                <Box
                  sx={{
                    width: { xs: 5, sm: 6 },
                    height: { xs: 5, sm: 6 },
                    borderRadius: '50%',
                    backgroundColor:
                      status === 'completed'
                        ? 'success.main'
                        : status === 'overdue'
                          ? 'error.main'
                          : 'transparent',
                  }}
                />
              </Box>
            )
          })}
        </Box>
      </Card>

      <Card sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ fontWeight: 600, color: 'success.main' }}>
            {DAILY_PROGRESS_LABEL}
          </Typography>
          <Typography sx={{ fontWeight: 700 }}>{progressPercentText}</Typography>
        </Box>
        <ProgressBar value={progressPercent} color="success" showLabel={false} height={8} />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          {habitsCompletedText}
        </Typography>
      </Card>

      <Card sx={{ p: 2 }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {progressForDateText}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {selectedDate.format('dddd')}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          {PROGRESS_SUBTITLE}
        </Typography>

        {activeHabits.length === 0 ? (
          <Typography variant={VARIANT_BODY1} color={COLOR_TEXT_SECONDARY}>
            {CHECKIN_CONTENT.PLACEHOLDERS.NO_HABITS}
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {sortedHabits.map((habit) => (
              <CheckinItemCard
                key={habit.id}
                habit={habit}
                checkin={getCheckinByHabitAndDate(habit.id, dateStr)}
                today={dateStr}
                onOpenModal={() => setModalHabit(habit)}
                isAtRisk={atRiskIds.has(habit.id)}
              />
            ))}
          </Box>
        )}
      </Card>

      <MultiCountModal
        open={!!modalHabit}
        onClose={() => setModalHabit(null)}
        habitId={modalHabit?.id ?? 0}
        habitName={modalHabit?.name ?? ''}
        targetPerDay={modalHabit?.targetPerDay ?? 1}
        date={dateStr}
        currentCount={
          modalHabit ? (getCheckinByHabitAndDate(modalHabit.id, dateStr)?.completedCount ?? 0) : 0
        }
      />
    </Box>
  )
}
