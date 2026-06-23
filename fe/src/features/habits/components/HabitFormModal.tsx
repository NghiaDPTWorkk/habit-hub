import React, { useEffect, useState } from 'react'
import { getLocalDateString, subtractDays } from '@/utils'
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
  useTheme,
  useMediaQuery,
} from '@/components/ui'
import { TextField } from '@/components/ui'
import { useHabitStore } from '@/features/habits/hooks'
import { habitFormSchema, defaultHabitFormValues } from '@/features/habits/constants/habitSchema'
import { HABITS_CONTENT, HABIT_FORM_CONTENT } from '@/features/habits/constants/content'
import { useBoundStore } from '@/store/useBoundStore'
import { SHARED_MESSAGES } from '@/constants/messages'
import type { ZodIssue } from 'zod'
import type { Habit, Category, Frequency, Priority } from '@/types'
import type { HabitFormValues } from '@/features/habits/constants/habitSchema'

export interface HabitFormModalProps {
  open: boolean
  onClose: () => void
  habitToEdit?: Habit
}

export const HabitFormModal: React.FC<HabitFormModalProps> = ({ open, onClose, habitToEdit }) => {
  const { addHabit, updateHabit } = useHabitStore()
  const showToast = useBoundStore((s) => s.showToast)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isEditMode = Boolean(habitToEdit)

  const [formValues, setFormValues] = useState<HabitFormValues>(() =>
    habitToEdit
      ? {
          startDate: habitToEdit.createdAt,
          name: habitToEdit.name,
          category: habitToEdit.category,
          frequency: habitToEdit.frequency,
          specificDays: habitToEdit.specificDays,
          targetPerDay: habitToEdit.targetPerDay,
          priority: habitToEdit.priority,
        }
      : defaultHabitFormValues
  )
  const [errors, setErrors] = useState<Partial<Record<keyof HabitFormValues, string>>>({})

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setFormValues(
          habitToEdit
            ? {
                startDate: habitToEdit.createdAt,
                name: habitToEdit.name,
                category: habitToEdit.category,
                frequency: habitToEdit.frequency,
                specificDays: habitToEdit.specificDays,
                targetPerDay: habitToEdit.targetPerDay,
                priority: habitToEdit.priority,
              }
            : defaultHabitFormValues
        )
        setErrors({})
      }, 0)
    }
  }, [open, habitToEdit])

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
      showToast(SHARED_MESSAGES.SUCCESS.UPDATE, 'success')
    } else {
      addHabit(result.data)
      showToast(SHARED_MESSAGES.SUCCESS.CREATE, 'success')
    }
    handleClose()
  }

  const toggleDay = (day: number) => {
    const current = formValues.specificDays ?? []
    const updated = current.includes(day) ? current.filter((d) => d !== day) : [...current, day]
    setFormValues((prev) => ({ ...prev, specificDays: updated }))
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" fullScreen={isMobile}>
      <DialogTitle>
        {isEditMode ? HABIT_FORM_CONTENT.TITLE_EDIT : HABIT_FORM_CONTENT.TITLE_CREATE}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
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
            <TextField
              label="Start date"
              type="date"
              value={formValues.startDate}
              disabled={isEditMode}
              slotProps={{
                htmlInput: { min: subtractDays(2), max: getLocalDateString() },
                inputLabel: { shrink: true },
              }}
              onChange={(e) => setFormValues((prev) => ({ ...prev, startDate: e.target.value }))}
            />
            {errors.startDate && (
              <Typography variant="caption" color="error.main">
                {errors.startDate}
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
                {HABIT_FORM_CONTENT.CATEGORY_OPTIONS.map((opt) => (
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
                {HABIT_FORM_CONTENT.FREQUENCY_OPTIONS.map((opt) => (
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
                {HABIT_FORM_CONTENT.SPECIFIC_DAYS_LABEL}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {HABIT_FORM_CONTENT.DAY_LABELS.map((label, index) => {
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
                {HABIT_FORM_CONTENT.PRIORITY_OPTIONS.map((opt) => (
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          {HABITS_CONTENT.BUTTONS.CANCEL}
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {isEditMode ? HABITS_CONTENT.BUTTONS.EDIT : HABITS_CONTENT.BUTTONS.CREATE}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
