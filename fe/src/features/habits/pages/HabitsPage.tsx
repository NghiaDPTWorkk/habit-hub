import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import { AddIcon, FilterListIcon } from '@/components/ui/icons'
import { EmptyState } from '@/components/ui/EmptyState'
import { HabitCard } from '../components/HabitCard'
import { HabitFormModal } from '../components/HabitFormModal'
import { FilterSidebar } from '../components/FilterSidebar'
import { listHabits } from '@/services/HabitsService'
import { getDashboard } from '@/services/StatsService'
import { useBoundStore } from '@/store/useBoundStore'
import type { Habit, HabitFilters, Category, Priority, HabitStatus, FrequencyType } from '@/types'

const PAGE_TITLE = 'Habits'
const NEW_HABIT_LABEL = 'New habit'

export function HabitsPage() {
  const [params, setParams] = useSearchParams()
  const [formOpen, setFormOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const habits = useBoundStore((s) => s.habits)
  const checkIns = useBoundStore((s) => s.checkIns)
  const goals = useBoundStore((s) => s.goals)

  const filters: HabitFilters = {
    category: (params.get('category') as Category) || undefined,
    priority: (params.get('priority') as Priority) || undefined,
    status: (params.get('status') as HabitStatus) || undefined,
    frequencyType: (params.get('frequencyType') as FrequencyType) || undefined,
  }

  const hasFilters = Object.values(filters).some(Boolean)

  const filteredHabits = useMemo(() => {
    void habits
    return listHabits(filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habits, params])

  const atRiskIds = useMemo(
    () => getDashboard(habits, checkIns, goals).summary.atRiskHabitIds,
    [habits, checkIns, goals]
  )

  function openCreate() {
    setEditingHabit(null)
    setFormOpen(true)
  }

  function openEdit(habit: Habit) {
    setEditingHabit(habit)
    setFormOpen(true)
  }

  function clearFilters() {
    setParams({}, { replace: true })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, flexGrow: 1 }}>
          {PAGE_TITLE}
        </Typography>
        <IconButton onClick={() => setDrawerOpen(true)} sx={{ display: { md: 'none' } }}>
          <FilterListIcon />
        </IconButton>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          {NEW_HABIT_LABEL}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <FilterSidebar />
        </Box>
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{ display: { md: 'none' } }}
          slotProps={{ paper: { sx: { p: 3, width: 240 } } }}
        >
          <FilterSidebar />
        </Drawer>

        <Box sx={{ flexGrow: 1 }}>
          {filteredHabits.length === 0 && !hasFilters && (
            <EmptyState
              title="No habits yet"
              description="Start building your routine by creating your first habit."
              actionLabel="Create your first habit"
              onAction={openCreate}
            />
          )}
          {filteredHabits.length === 0 && hasFilters && (
            <EmptyState
              title="No habits match these filters"
              description="Try adjusting or clearing your filters."
              actionLabel="Clear filters"
              onAction={clearFilters}
            />
          )}
          {filteredHabits.length > 0 && (
            <Grid container spacing={2}>
              {filteredHabits.map((habit) => (
                <Grid key={habit.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <HabitCard
                    habit={habit}
                    isAtRisk={atRiskIds.includes(habit.id)}
                    onEdit={() => openEdit(habit)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>

      <HabitFormModal open={formOpen} onClose={() => setFormOpen(false)} editHabit={editingHabit} />
    </Box>
  )
}
