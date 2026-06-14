import { type FC } from 'react'
import Box from '@mui/material/Box'
import { Button } from '@/components/ui/Button'
import { HabitCard } from './HabitCard'
import type { Habit } from '@/types'

const HABIT_LIST_TEXT = {
  emptyMessage: 'No habits match the selected filters.',
  noDataTitle: 'Bạn chưa có thói quen nào',
  noDataSubtitle: 'Bắt đầu tạo thói quen để theo dõi tiến độ mỗi ngày.',
  createButton: 'Tạo ngay',
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
      return <Box sx={{ color: 'text.secondary' }}>{HABIT_LIST_TEXT.emptyMessage}</Box>
    }

    return (
      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          gap: 2,
          minHeight: 360,
          px: 2,
        }}
      >
        <Box sx={{ width: 220, height: 220, mx: 'auto' }}>
          <svg
            viewBox="0 0 220 220"
            width="100%"
            height="100%"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="20" y="30" width="180" height="140" rx="20" fill="#E3F2FD" />
            <path d="M60 80H160" stroke="#90CAF9" strokeWidth="12" strokeLinecap="round" />
            <path d="M60 110H160" stroke="#90CAF9" strokeWidth="12" strokeLinecap="round" />
            <path d="M60 140H110" stroke="#90CAF9" strokeWidth="12" strokeLinecap="round" />
            <circle cx="80" cy="175" r="18" fill="#BBDEFB" />
            <circle cx="140" cy="175" r="18" fill="#64B5F6" />
            <path d="M80 175L140 175" stroke="#42A5F5" strokeWidth="10" strokeLinecap="round" />
          </svg>
        </Box>
        <Box>
          <Box component="p" sx={{ typography: 'h6', fontWeight: 700, mb: 1 }}>
            {HABIT_LIST_TEXT.noDataTitle}
          </Box>
          <Box component="p" sx={{ color: 'text.secondary', mb: 0 }}>
            {HABIT_LIST_TEXT.noDataSubtitle}
          </Box>
        </Box>
        <Button variant="contained" size="large" onClick={onCreate}>
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
          lg: '1fr 1fr 1fr',
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
