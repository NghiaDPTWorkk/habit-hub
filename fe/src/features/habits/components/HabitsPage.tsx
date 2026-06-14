import { type FC, useMemo, useState } from 'react'
import { Box, Typography, Drawer, IconButton, ConfirmDialog } from '@/components/ui'
import { Button } from '@/components/ui'
import { Card } from '@/components/ui/Card'
import { Icons } from '@/components/ui/icons'
import { useBoundStore } from '@/store/useBoundStore'
import { useHabitStore } from '@/features/habits/hooks'
import { HabitFormModal } from './HabitFormModal'
import { HabitList } from './HabitList'
import { FilterSideBar } from './FilterSideBar'
import { SHARED_MESSAGES } from '@/constants/messages'
import type { HabitFilters } from './FilterSideBar'
import type { Habit } from '@/types'
import { ShareProgressButton } from './ShareProgressButton'

const PAGE_TITLE = 'Habits'
const PAGE_DESC = 'Build and manage all the habits you want to track.'
const ADD_HABIT_LABEL = 'Add Habit'
const FILTER_BUTTON_LABEL = 'Filters'

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

export const HabitsPage: FC = () => {
  const { habits, deleteHabit, pauseHabit, resumeHabit, archiveHabit } = useHabitStore()
  const checkins = useBoundStore((state) => state.checkins)
  const showToast = useBoundStore((s) => s.showToast)

  const [filters, setFilters] = useState<HabitFilters>(DEFAULT_FILTERS)
  const [modalOpen, setModalOpen] = useState(false)
  const [habitToEdit, setHabitToEdit] = useState<Habit | undefined>(undefined)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [habitToDelete, setHabitToDelete] = useState<Habit | undefined>(undefined)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

  const todayCheckinByHabit = useMemo(
    () =>
      Object.values(checkins).reduce<Record<number, { completedCount: number }>>((acc, checkin) => {
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

  const handleEdit = (habit: Habit) => {
    setHabitToEdit(habit)
    setModalOpen(true)
  }

  const handleDelete = (habit: Habit) => {
    setHabitToDelete(habit)
    setDeleteDialogOpen(true)
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
    setHabitToDelete(undefined)
  }

  const handleConfirmDelete = () => {
    if (habitToDelete) {
      deleteHabit(habitToDelete.id)
      showToast(SHARED_MESSAGES.SUCCESS.DELETE, 'success')
    }
    setDeleteDialogOpen(false)
    setHabitToDelete(undefined)
  }

  const handlePauseResume = (habit: Habit) => {
    if (habit.status === 'Active') {
      pauseHabit(habit.id)
    } else {
      resumeHabit(habit.id)
    }
    showToast(SHARED_MESSAGES.SUCCESS.STATUS_CHANGE, 'success')
  }

  const handleArchive = (habit: Habit) => {
    archiveHabit(habit.id)
    showToast(SHARED_MESSAGES.SUCCESS.STATUS_CHANGE, 'success')
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
    <Box sx={{ p: 3, maxWidth: '100vw' }}>
      <Typography variant="h4" gutterBottom>
        {PAGE_TITLE}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {PAGE_DESC}
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
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Icons.Add />}
                onClick={() => {
                  setHabitToEdit(undefined)
                  setModalOpen(true)
                }}
              >
                {ADD_HABIT_LABEL}
              </Button>
              <ShareProgressButton />
              <IconButton
                sx={{ display: { xs: 'flex', md: 'none' } }}
                onClick={() => setFilterDrawerOpen(true)}
              >
                <Typography variant="button">{FILTER_BUTTON_LABEL}</Typography>
              </IconButton>
            </Box>
          </Card>

          <Card sx={{ p: 2 }}>
            <HabitList
              habits={filteredHabits}
              hasAnyHabits={habits.length > 0}
              todayCheckinByHabit={todayCheckinByHabit}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPauseResume={handlePauseResume}
              onArchive={handleArchive}
              onCreate={() => {
                setHabitToEdit(undefined)
                setModalOpen(true)
              }}
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

      <HabitFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        habitToEdit={habitToEdit}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        title="Confirm Delete"
        content="Deleting this habit will remove all progress history. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        severity="error"
      />
    </Box>
  )
}
