import React from 'react'
import { Box, Typography, TextField, MenuItem, Button } from '@/components/ui'
import type { Category, Frequency, HabitStatus, Priority } from '@/types'

const FILTER_SIDEBAR_TEXT = {
  title: 'Filter habits',
  description: 'Refine habits by category, frequency, priority or status.',
  categoryLabel: 'Category',
  frequencyLabel: 'Frequency',
  priorityLabel: 'Priority',
  statusLabel: 'Status',
  allLabel: 'All',
  clearButton: 'Clear filters',
}

export type HabitFilters = {
  category: Category | 'All'
  frequency: Frequency | 'All'
  priority: Priority | 'All'
  status: HabitStatus | 'All'
}

export interface FilterSideBarProps {
  filters: HabitFilters
  onChange: (filters: HabitFilters) => void
  onClear: () => void
}

const categories: Category[] = ['Health', 'Study', 'Work', 'Mindfulness', 'Other']
const frequencies: Frequency[] = ['Daily', 'Specific']
const priorities: Priority[] = ['Low', 'Medium', 'High']
const statuses: HabitStatus[] = ['Active', 'Paused', 'Archived']

export const FilterSideBar: React.FC<FilterSideBarProps> = ({ filters, onChange, onClear }) => {
  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Box>
        <Typography variant="h6" gutterBottom>
          {FILTER_SIDEBAR_TEXT.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {FILTER_SIDEBAR_TEXT.description}
        </Typography>
      </Box>

      <TextField
        select
        label={FILTER_SIDEBAR_TEXT.categoryLabel}
        size="small"
        value={filters.category}
        onChange={(event) =>
          onChange({ ...filters, category: event.target.value as Category | 'All' })
        }
      >
        <MenuItem value={FILTER_SIDEBAR_TEXT.allLabel}>{FILTER_SIDEBAR_TEXT.allLabel}</MenuItem>
        {categories.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label={FILTER_SIDEBAR_TEXT.frequencyLabel}
        size="small"
        value={filters.frequency}
        onChange={(event) =>
          onChange({ ...filters, frequency: event.target.value as Frequency | 'All' })
        }
      >
        <MenuItem value={FILTER_SIDEBAR_TEXT.allLabel}>{FILTER_SIDEBAR_TEXT.allLabel}</MenuItem>
        {frequencies.map((frequency) => (
          <MenuItem key={frequency} value={frequency}>
            {frequency}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label={FILTER_SIDEBAR_TEXT.priorityLabel}
        size="small"
        value={filters.priority}
        onChange={(event) =>
          onChange({ ...filters, priority: event.target.value as Priority | 'All' })
        }
      >
        <MenuItem value={FILTER_SIDEBAR_TEXT.allLabel}>{FILTER_SIDEBAR_TEXT.allLabel}</MenuItem>
        {priorities.map((priority) => (
          <MenuItem key={priority} value={priority}>
            {priority}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label={FILTER_SIDEBAR_TEXT.statusLabel}
        size="small"
        value={filters.status}
        onChange={(event) =>
          onChange({ ...filters, status: event.target.value as HabitStatus | 'All' })
        }
      >
        <MenuItem value={FILTER_SIDEBAR_TEXT.allLabel}>{FILTER_SIDEBAR_TEXT.allLabel}</MenuItem>
        {statuses.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </TextField>

      <Button variant="outlined" onClick={onClear} sx={{ alignSelf: 'flex-start' }}>
        {FILTER_SIDEBAR_TEXT.clearButton}
      </Button>
    </Box>
  )
}
