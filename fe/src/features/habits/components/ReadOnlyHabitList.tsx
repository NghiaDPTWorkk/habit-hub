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
}

export const ReadOnlyHabitList: React.FC<ReadOnlyHabitListProps> = ({
  habits,
  todayCheckinByHabit,
  isHabitMissed,
}) => {
  if (habits.length === 0) {
    return <Typography color="text.secondary">{READ_ONLY_LIST_TEXTS.emptyMessage}</Typography>
  }

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      {habits.map((habit) => (
        <ReadOnlyHabitCard
          key={habit.id}
          habit={habit}
          todayCheckin={todayCheckinByHabit[habit.id]}
          isMissed={isHabitMissed(habit)}
        />
      ))}
    </Box>
  )
}
