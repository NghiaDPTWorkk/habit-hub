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
  useTheme,
} from '@/components/ui'
import Chip from '@mui/material/Chip'
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
import { todayString, isHabitMissed as helperIsHabitMissed } from '../utils/habitHelpers'
import {
  TEXT_SEARCH_PLACEHOLDER,
  TEXT_CATEGORY_LABEL,
  TEXT_FREQUENCY_LABEL,
  TEXT_STATUS_LABEL,
  TEXT_ALL_CATEGORIES,
  TEXT_ALL_FREQUENCIES,
  TEXT_ALL_STATUSES,
  TEXT_PRIORITY_LABEL,
  TEXT_CLEAR_FILTERS,
  TEXT_VAL_ALL,
  TEXT_VAL_HEALTH,
  TEXT_VAL_STUDY,
  TEXT_VAL_WORK,
  TEXT_VAL_MINDFULNESS,
  TEXT_VAL_OTHER,
  TEXT_VAL_DAILY,
  TEXT_VAL_SPECIFIC,
  TEXT_VAL_ACTIVE,
  TEXT_VAL_PAUSED,
  TEXT_VAL_ARCHIVED,
  PAGE_TITLE,
  PAGE_DESC,
  ADD_HABIT_LABEL,
} from '../constants/pageConstants'

const TEXT_HIGH_PRIORITY = 'High Priority'
const TEXT_MEDIUM_PRIORITY = 'Medium Priority'
const TEXT_LOW_PRIORITY = 'Low Priority'

const DEFAULT_FILTERS: HabitFilters = {
  category: 'All',
  frequency: 'All',
  priority: 'All',
  status: 'All',
}

const PRIORITY_OPTIONS = [
  { value: 'All', label: TEXT_VAL_ALL },
  { value: 'High', label: TEXT_HIGH_PRIORITY },
  { value: 'Medium', label: TEXT_MEDIUM_PRIORITY },
  { value: 'Low', label: TEXT_LOW_PRIORITY },
] as const

export const HabitsPage: FC = () => {
  const theme = useTheme()
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

  const filteredHabits = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    const filtered = habits.filter((h) => {
      if (term && !h.name.toLowerCase().includes(term)) return false
      if (filters.category !== 'All' && h.category !== filters.category) return false
      if (filters.frequency !== 'All' && h.frequency !== filters.frequency) return false
      if (filters.priority !== 'All' && h.priority !== filters.priority) return false
      if (filters.status !== 'All' && h.status !== filters.status) return false
      return true
    })
    return [...filtered].sort((a, b) => {
      const aMissed = helperIsHabitMissed(a, todayCheckinByHabit) ? 1 : 0
      const bMissed = helperIsHabitMissed(b, todayCheckinByHabit) ? 1 : 0
      return bMissed - aMissed
    })
  }, [habits, filters, searchTerm, todayCheckinByHabit])

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

  const isHabitMissed = (habit: Habit) => helperIsHabitMissed(habit, todayCheckinByHabit)

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
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            flexWrap: 'wrap',
            mt: 2,
            pt: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {TEXT_PRIORITY_LABEL}
          </Typography>
          {PRIORITY_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              label={opt.label}
              onClick={() => setFilters((prev) => ({ ...prev, priority: opt.value }))}
              color={filters.priority === opt.value ? 'primary' : 'default'}
              variant={filters.priority === opt.value ? 'filled' : 'outlined'}
              size="small"
            />
          ))}
          {(searchTerm ||
            filters.category !== 'All' ||
            filters.frequency !== 'All' ||
            filters.priority !== 'All' ||
            filters.status !== 'All') && (
            <Button
              size="small"
              onClick={() => {
                setFilters(DEFAULT_FILTERS)
                setSearchTerm('')
              }}
              sx={{ ml: 'auto' }}
            >
              {TEXT_CLEAR_FILTERS}
            </Button>
          )}
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
