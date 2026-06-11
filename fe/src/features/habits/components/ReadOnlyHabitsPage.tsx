import React, { useMemo, useState } from 'react'
import { Box, Typography, Drawer, IconButton } from '@/components/ui'
import { Card } from '@/components/ui/Card'
import { useBoundStore } from '@/store/useBoundStore'
import { useHabitStore } from '@/features/habits/hooks'
import { ReadOnlyHabitList } from './ReadOnlyHabitList'
import { FilterSideBar } from './FilterSideBar'
import type { HabitFilters } from './FilterSideBar'
import type { Habit } from '@/types'

const PAGE_TEXTS = {
  title: 'Habits',
  description: 'Read-only view of habits.',
  filterButton: 'Filters',
}

const DEFAULT_FILTERS: HabitFilters = {
  category: 'All',
  frequency: 'All',
  priority: 'All',
  status: 'All',
}

const todayString = new Date().toISOString().split('T')[0]
const todayWeekDay = new Date().getDay()

const isDueToday = (habit: Habit) => {
  if (habit.frequency === 'Daily') {
    return true
  }
  return Array.isArray(habit.specificDays) && habit.specificDays.includes(todayWeekDay)
}

export const ReadOnlyHabitsPage: React.FC = () => {
  const { habits } = useHabitStore()
  const checkins = useBoundStore((state) => state.checkins)

  const [filters, setFilters] = useState<HabitFilters>(DEFAULT_FILTERS)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

  const todayCheckinByHabit = useMemo(
    () =>
      checkins.reduce<Record<number, { completedCount: number }>>((acc, checkin) => {
        if (checkin.date === todayString) {
          acc[checkin.habitId] = { completedCount: checkin.completedCount }
        }
        return acc
      }, {}),
    [checkins]
  )

  const filteredHabits = useMemo(
    () =>
      habits.filter((habit) => {
        if (filters.category !== 'All' && habit.category !== filters.category) {
          return false
        }
        if (filters.frequency !== 'All' && habit.frequency !== filters.frequency) {
          return false
        }
        if (filters.priority !== 'All' && habit.priority !== filters.priority) {
          return false
        }
        if (filters.status !== 'All' && habit.status !== filters.status) {
          return false
        }
        return true
      }),
    [habits, filters]
  )

  const isHabitMissed = (habit: Habit) => {
    if (habit.status !== 'Active') {
      return false
    }
    if (!isDueToday(habit)) {
      return false
    }
    const todayCheckin = todayCheckinByHabit[habit.id]
    return !todayCheckin || todayCheckin.completedCount < habit.targetPerDay
  }

  return (
    <Box sx={{ p: 3, maxWidth: '100vw' }}>
      <Typography variant="h4" gutterBottom>
        {PAGE_TEXTS.title}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {PAGE_TEXTS.description}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', md: '320px 1fr' },
          maxWidth: '100vw',
        }}
      >
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Card sx={{ p: 2 }}>
            <FilterSideBar
              filters={filters}
              onChange={setFilters}
              onClear={() => setFilters(DEFAULT_FILTERS)}
            />
          </Card>
        </Box>

        <Box sx={{ display: 'grid', gap: 3 }}>
          <Card sx={{ p: 2, display: { xs: 'block', md: 'none' } }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <IconButton onClick={() => setFilterDrawerOpen(true)}>
                <Typography variant="button">{PAGE_TEXTS.filterButton}</Typography>
              </IconButton>
            </Box>
          </Card>

          <Card sx={{ p: 2 }}>
            <ReadOnlyHabitList
              habits={filteredHabits}
              todayCheckinByHabit={todayCheckinByHabit}
              isHabitMissed={isHabitMissed}
            />
          </Card>
        </Box>
      </Box>

      <Drawer anchor="left" open={filterDrawerOpen} onClose={() => setFilterDrawerOpen(false)}>
        <Box sx={{ maxWidth: 280, p: 2 }}>
          <FilterSideBar
            filters={filters}
            onChange={setFilters}
            onClear={() => {
              setFilters(DEFAULT_FILTERS)
              setFilterDrawerOpen(false)
            }}
          />
        </Box>
      </Drawer>
    </Box>
  )
}
