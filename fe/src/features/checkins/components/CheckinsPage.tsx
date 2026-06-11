import React, { useState, useMemo } from 'react'
import dayjs, { type Dayjs } from 'dayjs'
import { Box, Typography } from '@/components/ui'
import { DatePicker } from '@/components/ui'
import { pxToRem } from '@/utils'
import { useBoundStore } from '@/store'
import { useCheckinStore } from '../hooks'
import { CHECKIN_CONTENT } from '../constants'
import type { Habit } from '@/types'
import { CheckinItemCard } from './CheckinItemCard'
import { MultiCountModal } from './MultiCountModal'

const VARIANT_H5 = 'h5'
const VARIANT_BODY2 = 'body2'
const VARIANT_BODY1 = 'body1'
const COLOR_TEXT_SECONDARY = 'text.secondary'
const PICKER_LABEL = 'Select date'
const STATUS_ACTIVE = 'Active'
const FREQUENCY_DAILY = 'Daily'

export const CheckinsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs())
  const [modalHabit, setModalHabit] = useState<Habit | null>(null)
  const { getCheckinByHabitAndDate } = useCheckinStore()
  const habits = useBoundStore((state) => state.habits)

  const dateStr = selectedDate.format('YYYY-MM-DD')

  // dayjs .day(): 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const activeHabits = useMemo(() => {
    const dayOfWeek = selectedDate.day()
    return habits.filter((h) => {
      if (h.status !== STATUS_ACTIVE) return false
      if (h.frequency === FREQUENCY_DAILY) return true
      return h.specificDays?.includes(dayOfWeek) ?? false
    })
  }, [habits, selectedDate])

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant={VARIANT_H5} sx={{ mb: 1 }}>
        {CHECKIN_CONTENT.TITLE}
      </Typography>
      <Typography variant={VARIANT_BODY2} color={COLOR_TEXT_SECONDARY} sx={{ mb: 3 }}>
        {CHECKIN_CONTENT.SUBTITLE}
      </Typography>

      <Box sx={{ mb: 3, maxWidth: pxToRem(256) }}>
        <DatePicker
          value={selectedDate}
          onChange={(v) => {
            if (v) setSelectedDate(v)
          }}
          label={PICKER_LABEL}
          disableFuture
        />
      </Box>

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
