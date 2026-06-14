import { type FC, useMemo, useState } from 'react'
import {
  Box,
  Typography,
  ConfirmDialog,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@/components/ui'
import { Button } from '@/components/ui'
import { Card } from '@/components/ui/Card'
import { Icons } from '@/components/ui/icons'
import { useBoundStore } from '@/store/useBoundStore'
import { useHabitStore } from '@/features/habits/hooks'
import { HabitFormModal } from './HabitFormModal'
import { HabitList } from './HabitList'
import { SHARED_MESSAGES } from '@/constants/messages'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import type { HabitFilters } from './FilterSideBar'
import type { Category, Frequency, HabitStatus, Habit } from '@/types'

const TEXT_SEARCH_PLACEHOLDER = 'Tìm kiếm thói quen...'
const TEXT_CATEGORY_LABEL = 'Category'
const TEXT_FREQUENCY_LABEL = 'Frequency'
const TEXT_STATUS_LABEL = 'Status'
const TEXT_ALL_CATEGORIES = 'All Categories'
const TEXT_ALL_FREQUENCIES = 'All Frequencies'
const TEXT_ALL_STATUSES = 'All Status'

const TEXT_VAL_ALL = 'All'
const TEXT_VAL_HEALTH = 'Health'
const TEXT_VAL_STUDY = 'Study'
const TEXT_VAL_WORK = 'Work'
const TEXT_VAL_MINDFULNESS = 'Mindfulness'
const TEXT_VAL_OTHER = 'Other'
const TEXT_VAL_DAILY = 'Daily'
const TEXT_VAL_SPECIFIC = 'Specific'
const TEXT_VAL_ACTIVE = 'Active'
const TEXT_VAL_PAUSED = 'Paused'
const TEXT_VAL_ARCHIVED = 'Archived'

const PAGE_TITLE = 'Habits'
const PAGE_DESC = 'Build and manage all the habits you want to track.'
const ADD_HABIT_LABEL = 'Add Habit'

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
  const [searchTerm, setSearchTerm] = useState('')

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
        if (
          searchTerm.trim() !== '' &&
          !habit.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
        ) {
          return false
        }
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
    [habits, filters, searchTerm]
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

      <Card sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder={TEXT_SEARCH_PLACEHOLDER}
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 200, flexGrow: 1 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>{TEXT_CATEGORY_LABEL}</InputLabel>
            <Select
              label={TEXT_CATEGORY_LABEL}
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, category: e.target.value as Category | 'All' }))
              }
            >
              <MenuItem value={TEXT_VAL_ALL}>{TEXT_ALL_CATEGORIES}</MenuItem>
              <MenuItem value={TEXT_VAL_HEALTH}>{TEXT_VAL_HEALTH}</MenuItem>
              <MenuItem value={TEXT_VAL_STUDY}>{TEXT_VAL_STUDY}</MenuItem>
              <MenuItem value={TEXT_VAL_WORK}>{TEXT_VAL_WORK}</MenuItem>
              <MenuItem value={TEXT_VAL_MINDFULNESS}>{TEXT_VAL_MINDFULNESS}</MenuItem>
              <MenuItem value={TEXT_VAL_OTHER}>{TEXT_VAL_OTHER}</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>{TEXT_FREQUENCY_LABEL}</InputLabel>
            <Select
              label={TEXT_FREQUENCY_LABEL}
              value={filters.frequency}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, frequency: e.target.value as Frequency | 'All' }))
              }
            >
              <MenuItem value={TEXT_VAL_ALL}>{TEXT_ALL_FREQUENCIES}</MenuItem>
              <MenuItem value={TEXT_VAL_DAILY}>{TEXT_VAL_DAILY}</MenuItem>
              <MenuItem value={TEXT_VAL_SPECIFIC}>{TEXT_VAL_SPECIFIC}</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>{TEXT_STATUS_LABEL}</InputLabel>
            <Select
              label={TEXT_STATUS_LABEL}
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value as HabitStatus | 'All' }))
              }
            >
              <MenuItem value={TEXT_VAL_ALL}>{TEXT_ALL_STATUSES}</MenuItem>
              <MenuItem value={TEXT_VAL_ACTIVE}>{TEXT_VAL_ACTIVE}</MenuItem>
              <MenuItem value={TEXT_VAL_PAUSED}>{TEXT_VAL_PAUSED}</MenuItem>
              <MenuItem value={TEXT_VAL_ARCHIVED}>{TEXT_VAL_ARCHIVED}</MenuItem>
            </Select>
          </FormControl>
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
