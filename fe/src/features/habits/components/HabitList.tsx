import React from 'react'
import Box from '@mui/material/Box'
import { HabitCard } from './HabitCard'
import type { Habit } from '@/types'

const HABIT_LIST_TEXT = {
  emptyMessage: 'No habits match the selected filters.',
}

export interface HabitListProps {
  habits: Habit[]
  todayCheckinByHabit: Record<number, { completedCount: number }>
  onEdit: (habit: Habit) => void
  onDelete: (habitId: number) => void
  onPauseResume: (habit: Habit) => void
  onArchive: (habit: Habit) => void
  isHabitMissed: (habit: Habit) => boolean
}

export const HabitList: React.FC<HabitListProps> = ({
  habits,
  todayCheckinByHabit,
  onEdit,
  onDelete,
  onPauseResume,
  onArchive,
  isHabitMissed,
}) => {
  if (habits.length === 0) {
    return <Box sx={{ color: 'text.secondary' }}>{HABIT_LIST_TEXT.emptyMessage}</Box>
  }

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          todayCheckin={todayCheckinByHabit[habit.id]}
          isMissed={isHabitMissed(habit)}
          onEdit={onEdit}
          onDelete={onDelete}
          onPauseResume={onPauseResume}
          onArchive={onArchive}
        />
      ))}
    </Box>
  )
}
