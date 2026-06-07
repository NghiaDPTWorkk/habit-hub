import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import FormHelperText from '@mui/material/FormHelperText'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import { AddIcon, CloseIcon } from '@/components/ui/icons'

const LABELS = {
  createTitle: 'New habit',
  editTitle: 'Edit habit',
  category: 'Category',
  frequency: 'Frequency',
  days: 'Days',
  priority: 'Priority',
  cancel: 'Cancel',
  create: 'Create habit',
  save: 'Save changes',
  decrement: '−',
}
import type { Habit, HabitInput, Category, FrequencyType, Priority, DayOfWeek } from '@/types'
import { CATEGORY_LABELS, PRIORITY_LABELS, FREQUENCY_LABELS, DAY_LABELS } from '@/types'
import { HabitInputSchema } from '@/schemas/validators'
import { createHabit, updateHabit } from '@/services/HabitsService'
import { useToast } from '@/hooks/useToast'
import { AppError } from '@/domain/AppError'

interface Props {
  open: boolean
  onClose: () => void
  editHabit?: Habit | null
}

const DAYS: DayOfWeek[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
]
const CATEGORIES: Category[] = ['HEALTH', 'STUDY', 'WORK', 'MINDFULNESS', 'OTHER']
const PRIORITIES: Priority[] = ['LOW', 'MEDIUM', 'HIGH']

type FieldErrors = Partial<Record<keyof HabitInput, string>>

function getInitial(habit?: Habit | null): HabitInput {
  return {
    name: habit?.name ?? '',
    category: habit?.category ?? 'HEALTH',
    frequencyType: habit?.frequencyType ?? 'DAILY',
    daysOfWeek: habit?.daysOfWeek ?? [],
    targetPerDay: habit?.targetPerDay ?? 1,
    priority: habit?.priority ?? 'MEDIUM',
  }
}

export function HabitFormModal({ open, onClose, editHabit }: Props) {
  const toast = useToast()
  const isEdit = Boolean(editHabit)

  const [form, setForm] = useState<HabitInput>(() => getInitial(editHabit))
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)

  function handleClose() {
    setForm(getInitial(editHabit))
    setErrors({})
    onClose()
  }

  function set<K extends keyof HabitInput>(key: K, val: HabitInput[K]) {
    setForm((f) => ({ ...f, [key]: val }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function validate(): boolean {
    const result = HabitInputSchema.safeParse(form)
    if (result.success) return true
    const newErrors: FieldErrors = {}
    for (const issue of result.error.errors) {
      const field = issue.path[0] as keyof HabitInput
      if (!newErrors[field]) newErrors[field] = issue.message
    }
    setErrors(newErrors)
    return false
  }

  function handleSubmit() {
    if (!validate()) return
    setSubmitting(true)
    try {
      if (isEdit && editHabit) {
        updateHabit(editHabit.id, form)
        toast.success('Habit updated')
      } else {
        createHabit(form)
        toast.success('Habit created')
      }
      handleClose()
    } catch (err) {
      if (err instanceof AppError) {
        toast.error(err.message)
        if (err.field) setErrors({ [err.field as keyof HabitInput]: err.message })
      } else {
        toast.error('Something went wrong')
      }
    } finally {
      setSubmitting(false)
    }
  }

  function toggleDay(day: DayOfWeek) {
    const next = form.daysOfWeek.includes(day)
      ? form.daysOfWeek.filter((d) => d !== day)
      : [...form.daysOfWeek, day]
    set('daysOfWeek', next)
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontWeight: 700 }}>
          {isEdit ? LABELS.editTitle : LABELS.createTitle}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Name */}
          <TextField
            label="Habit name"
            fullWidth
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            error={Boolean(errors.name)}
            helperText={errors.name}
            placeholder="e.g. Morning run"
            slotProps={{ htmlInput: { maxLength: 60 } }}
          />

          {/* Category */}
          <FormControl fullWidth error={Boolean(errors.category)}>
            <FormLabel sx={{ mb: 0.5, fontSize: 14, fontWeight: 600 }}>{LABELS.category}</FormLabel>
            <Select
              size="small"
              value={form.category}
              onChange={(e) => set('category', e.target.value as Category)}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Frequency */}
          <FormControl error={Boolean(errors.frequencyType)}>
            <FormLabel sx={{ mb: 0.5, fontSize: 14, fontWeight: 600 }}>
              {LABELS.frequency}
            </FormLabel>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={form.frequencyType}
              onChange={(_, val) => val && set('frequencyType', val as FrequencyType)}
            >
              <ToggleButton value="DAILY">{FREQUENCY_LABELS.DAILY}</ToggleButton>
              <ToggleButton value="SPECIFIC_DAYS">{FREQUENCY_LABELS.SPECIFIC_DAYS}</ToggleButton>
            </ToggleButtonGroup>
          </FormControl>

          {/* Days of week */}
          {form.frequencyType === 'SPECIFIC_DAYS' && (
            <FormControl error={Boolean(errors.daysOfWeek)}>
              <FormLabel sx={{ mb: 1, fontSize: 14, fontWeight: 600 }}>{LABELS.days}</FormLabel>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {DAYS.map((day) => (
                  <Chip
                    key={day}
                    label={DAY_LABELS[day]}
                    onClick={() => toggleDay(day)}
                    color={form.daysOfWeek.includes(day) ? 'primary' : 'default'}
                    variant={form.daysOfWeek.includes(day) ? 'filled' : 'outlined'}
                    size="small"
                    clickable
                  />
                ))}
              </Box>
              {errors.daysOfWeek && <FormHelperText>{errors.daysOfWeek}</FormHelperText>}
            </FormControl>
          )}

          {/* Target per day */}
          <TextField
            label="Daily target"
            type="number"
            size="small"
            value={form.targetPerDay}
            onChange={(e) => set('targetPerDay', Math.max(1, parseInt(e.target.value) || 1))}
            error={Boolean(errors.targetPerDay)}
            helperText={errors.targetPerDay ?? 'How many times per day?'}
            slotProps={{
              htmlInput: { min: 1, max: 100 },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      size="small"
                      onClick={() => set('targetPerDay', Math.max(1, form.targetPerDay - 1))}
                    >
                      <span style={{ fontWeight: 700, fontSize: 18, lineHeight: 1 }}>
                        {LABELS.decrement}
                      </span>
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => set('targetPerDay', form.targetPerDay + 1)}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Priority */}
          <FormControl error={Boolean(errors.priority)}>
            <FormLabel sx={{ mb: 0.5, fontSize: 14, fontWeight: 600 }}>{LABELS.priority}</FormLabel>
            <RadioGroup
              row
              value={form.priority}
              onChange={(e) => set('priority', e.target.value as Priority)}
            >
              {PRIORITIES.map((p) => (
                <FormControlLabel
                  key={p}
                  value={p}
                  control={<Radio size="small" />}
                  label={PRIORITY_LABELS[p]}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose}>{LABELS.cancel}</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
          {isEdit ? LABELS.save : LABELS.create}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
