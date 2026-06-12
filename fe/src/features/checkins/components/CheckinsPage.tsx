import React, { useState, useMemo } from 'react'
import dayjs, { type Dayjs } from 'dayjs'
import { Box, Typography, DatePicker, Alert, Button, Card, ProgressBar } from '@/components/ui'
import { pxToRem } from '@/utils'
import { useBoundStore } from '@/store'
import { useCheckinStore } from '../hooks'
import { CHECKIN_CONTENT } from '../constants'
import type { Habit } from '@/types'
import { CheckinItemCard } from './CheckinItemCard'
import { MultiCountModal } from './MultiCountModal'
import { isScheduledForDate } from '@/features/habits/services/ScheduleService'

const VARIANT_BODY1 = 'body1'
const COLOR_TEXT_SECONDARY = 'text.secondary'
const PICKER_LABEL = 'Select date'
const STATUS_ACTIVE = 'Active'
const FREQUENCY_DAILY = 'Daily'
const BANNER_TITLE = 'Habits need your attention'
const BTN_GO_TO_CHECKIN = 'Go to Check-in →'
const LOGS_HEADER = 'Check-in Logs'
const BTN_SHOW_PICKER = 'Show Monthly Calendar Picker'
const BTN_HIDE_PICKER = 'Hide Monthly Calendar Picker'
const DAILY_PROGRESS_LABEL = 'Daily Progress'
const PROGRESS_FOR_LABEL = 'Progress for '
const PROGRESS_SUBTITLE =
  'Shows habits scheduled for this date. 100% completed days are indicated by a green dot marker.'
const WEEK_DAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

export const CheckinsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs())
  const [modalHabit, setModalHabit] = useState<Habit | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const { getCheckinByHabitAndDate } = useCheckinStore()
  const habits = useBoundStore((state) => state.habits)
  const checkins = useBoundStore((state) => state.checkins)

  const dateStr = selectedDate.format('YYYY-MM-DD')

  const neglectedHabitInfo = (() => {
    const today = new Date()
    for (let d = 1; d <= 7; d++) {
      const checkDate = new Date()
      checkDate.setDate(today.getDate() - d)
      const offset = checkDate.getTimezoneOffset()
      const localDate = new Date(checkDate.getTime() - offset * 60 * 1000)
      const checkDateStr = localDate.toISOString().split('T')[0]

      for (const h of habits) {
        if (h.status !== STATUS_ACTIVE) continue
        if (isScheduledForDate(h, checkDateStr)) {
          const key = `${checkDateStr}_${h.id}`
          const checkin = checkins[key]
          const isCompleted = checkin && checkin.completedCount >= h.targetPerDay
          if (!isCompleted) {
            return {
              habit: h,
              daysAgo: d,
              dateStr: checkDateStr,
            }
          }
        }
      }
    }
    return null
  })()

  const neglectedHabitText = neglectedHabitInfo
    ? `${neglectedHabitInfo.habit.name} ${neglectedHabitInfo.daysAgo} days ago`
    : ''

  // dayjs .day(): 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const activeHabits = useMemo(() => {
    const dayOfWeek = selectedDate.day()
    return habits.filter((h) => {
      if (h.status !== STATUS_ACTIVE) return false
      if (h.frequency === FREQUENCY_DAILY) return true
      return h.specificDays?.includes(dayOfWeek) ?? false
    })
  }, [habits, selectedDate])

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
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {neglectedHabitInfo && (
        <Alert
          severity="warning"
          sx={{
            mb: 3,
            bgcolor: 'warning.light',
            color: 'warning.dark',
            border: '1px solid',
            borderColor: 'warning.main',
          }}
          action={
            <Button
              size="small"
              variant="text"
              sx={{ color: 'warning.dark', fontWeight: 600 }}
              onClick={() => setSelectedDate(dayjs(neglectedHabitInfo.dateStr))}
            >
              {BTN_GO_TO_CHECKIN}
            </Button>
          }
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {BANNER_TITLE}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block' }}>
            {neglectedHabitText}
          </Typography>
        </Alert>
      )}

      {/* Check-in Logs Header Row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {LOGS_HEADER}
        </Typography>
        <Button variant="outlined" size="small" onClick={() => setShowDatePicker((prev) => !prev)}>
          {showDatePicker ? BTN_HIDE_PICKER : BTN_SHOW_PICKER}
        </Button>
      </Box>

      {/* Conditionally rendered DatePicker */}
      {showDatePicker && (
        <Box sx={{ maxWidth: pxToRem(256) }}>
          <DatePicker
            value={selectedDate}
            onChange={(v) => {
              if (v) setSelectedDate(v)
            }}
            label={PICKER_LABEL}
            disableFuture
          />
        </Box>
      )}

      {/* Weekly Date Selector */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
        {weekDays.map((day, idx) => {
          const isSelected = day.isSame(selectedDate, 'day')
          const dateNum = day.date()
          const label = WEEK_DAY_LABELS[idx]

          return (
            <Box
              key={idx}
              onClick={() => setSelectedDate(day)}
              style={{
                backgroundColor: isSelected ? 'rgba(39, 174, 96, 0.04)' : undefined,
              }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 1.5,
                borderRadius: 1,
                border: '1px solid',
                borderColor: isSelected ? 'success.main' : 'divider',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'success.main',
                },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: isSelected ? 'success.main' : 'text.secondary',
                  mb: 0.5,
                }}
              >
                {label}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 700,
                  color: isSelected ? 'success.main' : 'text.primary',
                }}
              >
                {dateNum}
              </Typography>
            </Box>
          )
        })}
      </Box>

      {/* Daily Progress Card */}
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

      {/* Progress List Card */}
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
            {activeHabits.map((habit) => (
              <CheckinItemCard
                key={habit.id}
                habit={habit}
                checkin={getCheckinByHabitAndDate(habit.id, dateStr)}
                today={dateStr}
                onOpenModal={() => setModalHabit(habit)}
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
