import { type FC, useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
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
  Button,
  Card,
} from '@/components/ui'
import Chip from '@mui/material/Chip'
import { useBoundStore } from '@/store/useBoundStore'
import { useHabitStore } from '@/features/habits/hooks'
import { HabitFormModal } from './HabitFormModal'
import { HabitList } from './HabitList'
import { ShareProgressButton } from './ShareProgressButton'
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
  TEXT_PRIORITY_LABEL,
  TEXT_CLEAR_FILTERS,
  PAGE_TITLE,
  CATEGORY_OPTIONS,
  FREQUENCY_OPTIONS,
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
} from '../constants/pageConstants'

const DEFAULT_FILTERS: HabitFilters = {
  category: 'All',
  frequency: 'All',
  priority: 'All',
  status: 'All',
}

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

  const [searchParams, setSearchParams] = useSearchParams()
  const triggerCreate = searchParams.get('create') === 'true'

  useEffect(() => {
    if (triggerCreate) {
      setTimeout(() => {
        setHabitToEdit(undefined)
        setModalOpen(true)
        const newParams = new URLSearchParams(searchParams)
        newParams.delete('create')
        setSearchParams(newParams, { replace: true })
      }, 0)
    }
  }, [triggerCreate, searchParams, setSearchParams])

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
      // 1. Sort by status: Active > Paused > Archived
      const statusWeight = { Active: 3, Paused: 2, Archived: 1 }
      const aStatus = statusWeight[a.status] || 0
      const bStatus = statusWeight[b.status] || 0
      if (aStatus !== bStatus) return bStatus - aStatus

      // 2. Sort by priority: High > Medium > Low
      const priorityWeight = { High: 3, Medium: 2, Low: 1 }
      const aPriority = priorityWeight[a.priority] || 0
      const bPriority = priorityWeight[b.priority] || 0
      if (aPriority !== bPriority) return bPriority - aPriority

      // 3. Sort by missed status (Missed first to draw attention)
      const aMissed = helperIsHabitMissed(a, todayCheckinByHabit) ? 1 : 0
      const bMissed = helperIsHabitMissed(b, todayCheckinByHabit) ? 1 : 0
      if (aMissed !== bMissed) return bMissed - aMissed

      // 4. Stable sort by ID
      return a.id - b.id
    })
  }, [habits, filters, searchTerm, todayCheckinByHabit])

  const handleEdit = (h: Habit) => {
    setHabitToEdit(h)
    setModalOpen(true)
  }
  const handleDelete = (h: Habit) => {
    setHabitToDelete(h)
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
  const handlePauseResume = (h: Habit) => {
    if (h.status === 'Active') {
      pauseHabit(h.id)
    } else {
      resumeHabit(h.id)
    }
    showToast(SHARED_MESSAGES.SUCCESS.STATUS_CHANGE, 'success')
  }
  const handleArchive = (h: Habit) => {
    archiveHabit(h.id)
    showToast(SHARED_MESSAGES.SUCCESS.STATUS_CHANGE, 'success')
  }
  const isHabitMissed = (h: Habit) => helperIsHabitMissed(h, todayCheckinByHabit)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {PAGE_TITLE}
        </Typography>
        <ShareProgressButton />
      </Box>

      <Card sx={{ p: 2 }}>
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
              {CATEGORY_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
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
              {FREQUENCY_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
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
              {STATUS_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
              variant="outlined"
              sx={{
                fontWeight: 500,
                ...(filters.priority === opt.value && { bgcolor: 'primary.light' }),
              }}
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
