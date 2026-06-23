import React from 'react'
import { Box, Typography } from '@/components/ui'
import { ReadOnlyHabitCard } from './ReadOnlyHabitCard'
import type { Habit } from '@/types'

const READ_ONLY_LIST_TEXTS = {
  emptyMessage: 'No habits to display',
}

export interface ReadOnlyHabitListProps {
  habits: Habit[]
  todayCheckinByHabit: Record<number, { completedCount: number }>
  isHabitMissed: (habit: Habit) => boolean
  currentDayOfWeek: number
}

export const ReadOnlyHabitList: React.FC<ReadOnlyHabitListProps> = ({
  habits,
  todayCheckinByHabit,
  isHabitMissed,
  currentDayOfWeek,
}) => {
  if (habits.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">{READ_ONLY_LIST_TEXTS.emptyMessage}</Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: '1fr',
          sm: '1fr',
          md: '1fr 1fr',
          lg: '1fr 1fr',
        },
      }}
    >
      {habits.map((habit) => (
        <ReadOnlyHabitCard
          key={habit.id}
          habit={habit}
          todayCheckin={todayCheckinByHabit[habit.id]}
          isMissed={isHabitMissed(habit)}
          currentDayOfWeek={currentDayOfWeek}
        />
      ))}
    </Box>
  )
}
