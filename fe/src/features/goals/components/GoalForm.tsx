import React, { useState } from 'react'
import {
  Box,
  Stack,
  FormControl,
  FormLabel,
  FormHelperText,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  Button,
  TextField,
} from '@/components/ui'
import { useBoundStore } from '@/store/useBoundStore'
import type { TargetType } from '@/types'
import { GOALS_CONTENT } from '../constants/content'

const HABIT_SELECT_ID = 'goal-habit-select'
const TARGET_VALUE_STREAK = 'streak'
const TARGET_VALUE_TOTAL = 'total_completions'

export const GoalForm: React.FC = () => {
  const habits = useBoundStore((s) => s.habits)
  const addGoal = useBoundStore((s) => s.addGoal)

  const [habitId, setHabitId] = useState<number | ''>('')
  const [targetType, setTargetType] = useState<TargetType>('streak')
  const [targetValue, setTargetValue] = useState('')
  const [errors, setErrors] = useState<{ habitId?: string; targetValue?: string }>({})

  const validate = (): boolean => {
    const next: typeof errors = {}
    if (!habitId) next.habitId = GOALS_CONTENT.VALIDATION.HABIT_REQUIRED
    if (!targetValue || !Number.isInteger(Number(targetValue)) || Number(targetValue) <= 0) {
      next.targetValue = GOALS_CONTENT.VALIDATION.TARGET_INTEGER
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    addGoal({ habitId: habitId as number, targetType, targetValue: Number(targetValue) })
    setHabitId('')
    setTargetType('streak')
    setTargetValue('')
    setErrors({})
  }

  return (
    <Box sx={{ backgroundColor: 'background.paper', borderRadius: 2, p: 3, boxShadow: 1 }}>
      <Stack spacing={2}>
        <FormControl fullWidth error={!!errors.habitId}>
          <InputLabel id={HABIT_SELECT_ID}>{GOALS_CONTENT.FORM_LABELS.HABIT}</InputLabel>
          <Select
            labelId={HABIT_SELECT_ID}
            value={habitId}
            label={GOALS_CONTENT.FORM_LABELS.HABIT}
            onChange={(e) => {
              setHabitId(Number(e.target.value))
              setErrors((prev) => ({ ...prev, habitId: undefined }))
            }}
          >
            {habits.map((habit) => (
              <MenuItem key={habit.id} value={habit.id}>
                {habit.name}
              </MenuItem>
            ))}
          </Select>
          {errors.habitId && <FormHelperText>{errors.habitId}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth>
          <FormLabel sx={{ mb: 1, fontWeight: 600 }}>{GOALS_CONTENT.FORM_LABELS.TARGET_TYPE}</FormLabel>
          <RadioGroup
            value={targetType}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTargetType(e.target.value as TargetType)
            }
          >
            <FormControlLabel
              value={TARGET_VALUE_STREAK}
              control={<Radio />}
              label={GOALS_CONTENT.TARGET_TYPES.STREAK}
            />
            <FormControlLabel
              value={TARGET_VALUE_TOTAL}
              control={<Radio />}
              label={GOALS_CONTENT.TARGET_TYPES.TOTAL}
            />
          </RadioGroup>
        </FormControl>

        <FormControl fullWidth error={!!errors.targetValue}>
          <FormLabel sx={{ mb: 1, fontWeight: 600 }}>{GOALS_CONTENT.FORM_LABELS.TARGET_VALUE}</FormLabel>
          <TextField
            type="number"
            value={targetValue}
            onChange={(e) => {
              setTargetValue(e.target.value)
              if (Number.isInteger(Number(e.target.value)) && Number(e.target.value) > 0) {
                setErrors((prev) => ({ ...prev, targetValue: undefined }))
              }
            }}
            error={!!errors.targetValue}
            slotProps={{ htmlInput: { step: 1, min: 1 } }}
          />
          {errors.targetValue && <FormHelperText>{errors.targetValue}</FormHelperText>}
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ alignSelf: 'flex-end' }}
        >
          {GOALS_CONTENT.FORM_SUBMIT_ADD}
        </Button>
      </Stack>
    </Box>
  )
}
