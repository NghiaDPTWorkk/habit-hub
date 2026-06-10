import React, { useState } from 'react'
import {
  Box,
  Typography,
  Drawer,
  Divider,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from '@/components/ui'
import { Button } from '@/components/ui'
import { TextField } from '@/components/ui'
import { useHabitStore } from '@/features/habits/hooks'
import {
  habitFormSchema,
  defaultHabitFormValues,
} from '@/features/habits/constants/habitSchema'
import { HABITS_CONTENT } from '@/features/habits/constants/content'
import type { ZodIssue } from 'zod'
import type { Habit, Category, Frequency, Priority } from '@/types'
import type { HabitFormValues } from '@/features/habits/constants/habitSchema'

const FORM_CONTENT = {
  TITLE_CREATE: 'Tạo thói quen mới',
  TITLE_EDIT: 'Chỉnh sửa thói quen',
  SPECIFIC_DAYS_LABEL: 'Chọn ngày trong tuần',
  DAY_LABELS: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  CATEGORY_OPTIONS: [
    { value: 'Health' as Category, label: 'Health' },
    { value: 'Study' as Category, label: 'Study' },
    { value: 'Work' as Category, label: 'Work' },
    { value: 'Mindfulness' as Category, label: 'Mindfulness' },
    { value: 'Other' as Category, label: 'Other' },
  ],
  FREQUENCY_OPTIONS: [
    { value: 'Daily' as Frequency, label: 'Hàng ngày' },
    { value: 'Specific' as Frequency, label: 'Ngày cụ thể' },
  ],
  PRIORITY_OPTIONS: [
    { value: 'Low' as Priority, label: 'Thấp' },
    { value: 'Medium' as Priority, label: 'Trung bình' },
    { value: 'High' as Priority, label: 'Cao' },
  ],
}

export interface HabitFormModalProps {
  open: boolean
  onClose: () => void
  habitToEdit?: Habit
}

export const HabitFormModal: React.FC<HabitFormModalProps> = ({ open, onClose, habitToEdit }) => {
  const { addHabit, updateHabit } = useHabitStore()
  const isEditMode = Boolean(habitToEdit)

  const [formValues, setFormValues] = useState<HabitFormValues>(() =>
    habitToEdit
      ? {
          name: habitToEdit.name,
          category: habitToEdit.category,
          frequency: habitToEdit.frequency,
          specificDays: habitToEdit.specificDays,
          targetPerDay: habitToEdit.targetPerDay,
          priority: habitToEdit.priority,
        }
      : defaultHabitFormValues,
  )
  const [errors, setErrors] = useState<Partial<Record<keyof HabitFormValues, string>>>({})

  const handleClose = () => {
    setFormValues(defaultHabitFormValues)
    setErrors({})
    onClose()
  }

  const handleSubmit = () => {
    const result = habitFormSchema.safeParse(formValues)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof HabitFormValues, string>> = {}
      result.error.issues.forEach((err: ZodIssue) => {
        if (err.path.length > 0) {
          const field = err.path[0] as keyof HabitFormValues
          if (!fieldErrors[field]) {
            fieldErrors[field] = err.message
          }
        }
      })
      setErrors(fieldErrors)
      return
    }
    if (isEditMode && habitToEdit) {
      updateHabit(habitToEdit.id, result.data)
    } else {
      addHabit(result.data)
    }
    handleClose()
  }

  const toggleDay = (day: number) => {
    const current = formValues.specificDays ?? []
    const updated = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day]
    setFormValues((prev) => ({ ...prev, specificDays: updated }))
  }

  return (
    <Drawer anchor="right" open={open} onClose={handleClose}>
      <Box sx={{ width: 400, p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6">
          {isEditMode ? FORM_CONTENT.TITLE_EDIT : FORM_CONTENT.TITLE_CREATE}
        </Typography>
        <Divider />

        <Box>
          <TextField
            label={HABITS_CONTENT.FORM.NAME_LABEL}
            placeholder={HABITS_CONTENT.FORM.NAME_PLACEHOLDER}
            value={formValues.name}
            onChange={(e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))}
          />
          {errors.name && (
            <Typography variant="caption" color="error.main">
              {errors.name}
            </Typography>
          )}
        </Box>

        <Box>
          <FormControl fullWidth size="small">
            <InputLabel>{HABITS_CONTENT.FORM.CATEGORY_LABEL}</InputLabel>
            <Select
              value={formValues.category}
              label={HABITS_CONTENT.FORM.CATEGORY_LABEL}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, category: e.target.value as Category }))
              }
            >
              {FORM_CONTENT.CATEGORY_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {errors.category && (
            <Typography variant="caption" color="error.main">
              {errors.category}
            </Typography>
          )}
        </Box>

        <Box>
          <FormControl fullWidth size="small">
            <InputLabel>{HABITS_CONTENT.FORM.FREQUENCY_LABEL}</InputLabel>
            <Select
              value={formValues.frequency}
              label={HABITS_CONTENT.FORM.FREQUENCY_LABEL}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, frequency: e.target.value as Frequency }))
              }
            >
              {FORM_CONTENT.FREQUENCY_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {errors.frequency && (
            <Typography variant="caption" color="error.main">
              {errors.frequency}
            </Typography>
          )}
        </Box>

        {formValues.frequency === 'Specific' && (
          <Box>
            <Typography variant="body2" gutterBottom>
              {FORM_CONTENT.SPECIFIC_DAYS_LABEL}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {FORM_CONTENT.DAY_LABELS.map((label, index) => {
                const isActive = formValues.specificDays?.includes(index) ?? false
                return (
                  <Box
                    key={index}
                    onClick={() => toggleDay(index)}
                    sx={{
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1,
                      cursor: 'pointer',
                      bgcolor: isActive ? 'primary.main' : 'background.paper',
                      color: isActive ? 'common.white' : 'text.primary',
                      border: '1px solid',
                      borderColor: isActive ? 'primary.main' : 'divider',
                      userSelect: 'none',
                    }}
                  >
                    <Typography variant="caption">{label}</Typography>
                  </Box>
                )
              })}
            </Box>
            {errors.specificDays && (
              <Typography variant="caption" color="error.main">
                {errors.specificDays}
              </Typography>
            )}
          </Box>
        )}

        <Box>
          <TextField
            label={HABITS_CONTENT.FORM.TARGET_LABEL}
            type="number"
            slotProps={{ htmlInput: { min: 1 } }}
            value={formValues.targetPerDay}
            onChange={(e) => {
              const parsed = parseInt(e.target.value, 10)
              setFormValues((prev) => ({
                ...prev,
                targetPerDay: Number.isNaN(parsed) ? prev.targetPerDay : parsed,
              }))
            }}
          />
          {errors.targetPerDay && (
            <Typography variant="caption" color="error.main">
              {errors.targetPerDay}
            </Typography>
          )}
        </Box>

        <Box>
          <FormControl fullWidth size="small">
            <InputLabel>{HABITS_CONTENT.FORM.PRIORITY_LABEL}</InputLabel>
            <Select
              value={formValues.priority}
              label={HABITS_CONTENT.FORM.PRIORITY_LABEL}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, priority: e.target.value as Priority }))
              }
            >
              {FORM_CONTENT.PRIORITY_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {errors.priority && (
            <Typography variant="caption" color="error.main">
              {errors.priority}
            </Typography>
          )}
        </Box>

        <Divider />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={handleClose}>
            {HABITS_CONTENT.BUTTONS.CANCEL}
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            {isEditMode ? HABITS_CONTENT.BUTTONS.EDIT : HABITS_CONTENT.BUTTONS.CREATE}
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}
