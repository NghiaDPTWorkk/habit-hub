import React, { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Card } from '@/components/ui/Card'
import { useBoundStore } from '@/store/useBoundStore'
import { HabitForm, type HabitFormState } from './HabitForm'
import { HabitList } from './HabitList'
import { FilterSideBar } from './FilterSideBar'
import type { HabitFilters } from './FilterSideBar'
import type { Habit } from '@/types'

const PAGE_TITLE = 'Habits'
const PAGE_DESC = 'Build and manage all the habits you want to track.'

const initialFormState: HabitFormState = {
  name: '',
  category: 'Health',
  frequency: 'Daily',
  specificDays: null,
  targetPerDay: 1,
  priority: 'Medium',
  status: 'Active',
}

const todayString = new Date().toISOString().split('T')[0]
const todayWeekDay = new Date().getDay()

const isDueToday = (habit: Habit) => {
  if (habit.frequency === 'Daily') {
    return true
  }
  return Array.isArray(habit.specificDays) && habit.specificDays.includes(todayWeekDay)
}

export const HabitsPage: React.FC = () => {
  const habits = useBoundStore((state) => state.habits)
  const checkins = useBoundStore((state) => state.checkins)
  const addHabit = useBoundStore((state) => state.addHabit)
  const updateHabit = useBoundStore((state) => state.updateHabit)
  const deleteHabit = useBoundStore((state) => state.deleteHabit)

  const DEFAULT_FILTERS: HabitFilters = {
    category: 'All',
    frequency: 'All',
    priority: 'All',
    status: 'All',
  }

  const [filters, setFilters] = useState<HabitFilters>(DEFAULT_FILTERS)
  const [formState, setFormState] = useState<HabitFormState>(initialFormState)
  const [editingId, setEditingId] = useState<number | null>(null)

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

  const clearForm = () => {
    setFormState(initialFormState)
    setEditingId(null)
  }

  const handleSubmit = () => {
    const payload = {
      name: formState.name.trim(),
      category: formState.category,
      frequency: formState.frequency,
      specificDays: formState.frequency === 'Daily' ? null : formState.specificDays || [],
      targetPerDay: Number(formState.targetPerDay) || 1,
      priority: formState.priority,
      status: formState.status,
    }

    if (!payload.name) {
      return
    }

    if (editingId !== null) {
      updateHabit(editingId, payload)
    } else {
      addHabit(payload)
    }

    clearForm()
  }

  const handleEdit = (habit: Habit) => {
    setEditingId(habit.id)
    setFormState({
      name: habit.name,
      category: habit.category,
      frequency: habit.frequency,
      specificDays: habit.specificDays ?? null,
      targetPerDay: habit.targetPerDay,
      priority: habit.priority,
      status: habit.status,
    })
  }

  const handlePauseResume = (habit: Habit) => {
    if (habit.status === 'Active') {
      updateHabit(habit.id, { status: 'Paused' })
      return
    }
    if (habit.status === 'Paused') {
      updateHabit(habit.id, { status: 'Active' })
      return
    }
    updateHabit(habit.id, { status: 'Active' })
  }

  const handleArchive = (habit: Habit) => {
    updateHabit(habit.id, { status: 'Archived' })
  }

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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {PAGE_TITLE}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {PAGE_DESC}
      </Typography>
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '320px 1fr' } }}>
        <Card sx={{ p: 2 }}>
          <FilterSideBar
            filters={filters}
            onChange={setFilters}
            onClear={() => setFilters(DEFAULT_FILTERS)}
          />
        </Card>

        <Box sx={{ display: 'grid', gap: 3 }}>
          <Card sx={{ p: 2 }}>
            <HabitForm
              formState={formState}
              setFormState={setFormState}
              editingId={editingId}
              onSubmit={handleSubmit}
              onReset={clearForm}
            />
          </Card>

          <Card sx={{ p: 2 }}>
            <HabitList
              habits={filteredHabits}
              todayCheckinByHabit={todayCheckinByHabit}
              onEdit={handleEdit}
              onDelete={deleteHabit}
              onPauseResume={handlePauseResume}
              onArchive={handleArchive}
              isHabitMissed={isHabitMissed}
            />
          </Card>
        </Box>
      </Box>
    </Box>
  )
}
