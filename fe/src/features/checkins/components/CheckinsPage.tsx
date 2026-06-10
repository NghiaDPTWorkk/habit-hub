import React, { useState } from 'react'
import { Box, Typography } from '@/components/ui'
import { ProgressBar } from '@/components/ui'
import { useBoundStore } from '@/store'
import { useCheckinStore } from '../hooks'
import { CHECKIN_CONTENT } from '../constants'
import { CheckinItemCard } from './CheckinItemCard'
import { MultiCountModal } from './MultiCountModal'
import type { Habit } from '@/types'

const VARIANT_H5 = 'h5'
const VARIANT_BODY2 = 'body2'
const COLOR_TEXT_SECONDARY = 'text.secondary'
const COLOR_SUCCESS = 'success'
const STATUS_ACTIVE = 'Active'

export const CheckinsPage: React.FC = () => {
  const habits = useBoundStore((state) => state.habits)
  const { today, todayProgress, getCheckinByHabitAndDate } = useCheckinStore()
  const [modalHabit, setModalHabit] = useState<Habit | null>(null)

  const activeHabits = habits.filter((h) => h.status === STATUS_ACTIVE)

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant={VARIANT_H5} sx={{ mb: 1 }}>
        {CHECKIN_CONTENT.TITLE}
      </Typography>
      <Typography variant={VARIANT_BODY2} color={COLOR_TEXT_SECONDARY} sx={{ mb: 1 }}>
        {CHECKIN_CONTENT.PROGRESS_LABEL}
      </Typography>
      <Box sx={{ mb: 3 }}>
        <ProgressBar value={todayProgress} color={COLOR_SUCCESS} />
      </Box>

      {activeHabits.length === 0 ? (
        <Typography color={COLOR_TEXT_SECONDARY}>
          {CHECKIN_CONTENT.PLACEHOLDERS.NO_HABITS}
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {activeHabits.map((habit) => (
            <CheckinItemCard
              key={habit.id}
              habit={habit}
              checkin={getCheckinByHabitAndDate(habit.id, today)}
              today={today}
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
        date={today}
        currentCount={
          modalHabit ? (getCheckinByHabitAndDate(modalHabit.id, today)?.completedCount ?? 0) : 0
        }
      />
    </Box>
  )
}
