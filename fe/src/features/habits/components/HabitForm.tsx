import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { Button } from '@/components/ui/Button'
import type { Category, Frequency, HabitStatus, Priority } from '@/types'

const FORM_TEXTS = {
  addHabit: 'Add habit',
  editHabit: 'Edit habit',
  habitName: 'Habit name',
  category: 'Category',
  frequency: 'Frequency',
  specificDays: 'Specific days',
  targetPerDay: 'Target per day',
  priority: 'Priority',
  status: 'Status',
  createHabit: 'Create habit',
  updateHabit: 'Update habit',
  reset: 'Reset',
}

export type HabitFormState = {
  name: string
  category: Category
  frequency: Frequency
  specificDays: number[] | null
  targetPerDay: number
  priority: Priority
  status: HabitStatus
}

const categories: Category[] = ['Health', 'Study', 'Work', 'Mindfulness', 'Other']
const frequencies: Frequency[] = ['Daily', 'Specific']
const priorities: Priority[] = ['Low', 'Medium', 'High']
const statuses: HabitStatus[] = ['Active', 'Paused', 'Archived']
const weekDays = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
]

interface HabitFormProps {
  formState: HabitFormState
  setFormState: React.Dispatch<React.SetStateAction<HabitFormState>>
  editingId: number | null
  onSubmit: () => void
  onReset: () => void
}

export const HabitForm: React.FC<HabitFormProps> = ({
  formState,
  setFormState,
  editingId,
  onSubmit,
  onReset,
}) => {
  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Typography variant="h6" gutterBottom>
        {editingId !== null ? FORM_TEXTS.editHabit : FORM_TEXTS.addHabit}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <TextField
        fullWidth
        label={FORM_TEXTS.habitName}
        value={formState.name}
        onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
      />

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
        <TextField
          select
          fullWidth
          label={FORM_TEXTS.category}
          value={formState.category}
          onChange={(event) =>
            setFormState((prev) => ({ ...prev, category: event.target.value as Category }))
          }
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label={FORM_TEXTS.frequency}
          value={formState.frequency}
          onChange={(event) =>
            setFormState((prev) => ({
              ...prev,
              frequency: event.target.value as Frequency,
              specificDays: event.target.value === 'Daily' ? null : (prev.specificDays ?? []),
            }))
          }
        >
          {frequencies.map((frequency) => (
            <MenuItem key={frequency} value={frequency}>
              {frequency}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {formState.frequency === 'Specific' && (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {FORM_TEXTS.specificDays}
          </Typography>
          <FormGroup row>
            {weekDays.map((day) => {
              const checked = formState.specificDays?.includes(day.value) ?? false
              return (
                <FormControlLabel
                  key={day.value}
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={(event) => {
                        const nextDays = new Set(formState.specificDays ?? [])
                        if (event.target.checked) {
                          nextDays.add(day.value)
                        } else {
                          nextDays.delete(day.value)
                        }
                        setFormState((prev) => ({ ...prev, specificDays: Array.from(nextDays) }))
                      }}
                    />
                  }
                  label={day.label}
                />
              )
            })}
          </FormGroup>
        </Box>
      )}

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
        <TextField
          fullWidth
          label={FORM_TEXTS.targetPerDay}
          type="number"
          value={formState.targetPerDay}
          onChange={(event) =>
            setFormState((prev) => ({ ...prev, targetPerDay: Number(event.target.value) }))
          }
        />
        <TextField
          select
          fullWidth
          label={FORM_TEXTS.priority}
          value={formState.priority}
          onChange={(event) =>
            setFormState((prev) => ({ ...prev, priority: event.target.value as Priority }))
          }
        >
          {priorities.map((priority) => (
            <MenuItem key={priority} value={priority}>
              {priority}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <TextField
        select
        fullWidth
        label={FORM_TEXTS.status}
        value={formState.status}
        onChange={(event) =>
          setFormState((prev) => ({ ...prev, status: event.target.value as HabitStatus }))
        }
      >
        {statuses.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </TextField>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Button variant="contained" onClick={onSubmit}>
          {editingId !== null ? FORM_TEXTS.updateHabit : FORM_TEXTS.createHabit}
        </Button>
        <Button variant="outlined" onClick={onReset}>
          {FORM_TEXTS.reset}
        </Button>
      </Box>
    </Box>
  )
}
