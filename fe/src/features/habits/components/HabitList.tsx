import { type FC } from 'react'
import { Box, Button, EmptyState } from '@/components/ui'
import { HabitCard } from './HabitCard'
import type { Habit } from '@/types'

const HABIT_LIST_TEXT = {
  emptyMessage: 'No habits match the selected filters.',
  noDataTitle: 'You have no habits yet',
  noDataSubtitle: 'Start creating habits to track your daily progress.',
  createButton: 'Create Now',
}

export interface HabitListProps {
  habits: Habit[]
  hasAnyHabits: boolean
  todayCheckinByHabit: Record<number, { completedCount: number }>
  onEdit: (habit: Habit) => void
  onDelete: (habit: Habit) => void
  onPauseResume: (habit: Habit) => void
  onArchive: (habit: Habit) => void
  onCreate: () => void
  isHabitMissed: (habit: Habit) => boolean
}

export const HabitList: FC<HabitListProps> = ({
  habits,
  hasAnyHabits,
  todayCheckinByHabit,
  onEdit,
  onDelete,
  onPauseResume,
  onArchive,
  onCreate,
  isHabitMissed,
}) => {
  if (habits.length === 0) {
    if (hasAnyHabits) {
      return <EmptyState message={HABIT_LIST_TEXT.emptyMessage} />
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, mt: 4 }}>
        <EmptyState message={`${HABIT_LIST_TEXT.noDataTitle}. ${HABIT_LIST_TEXT.noDataSubtitle}`} />
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={onCreate}
          sx={{ borderRadius: 2 }}
        >
          {HABIT_LIST_TEXT.createButton}
        </Button>
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
