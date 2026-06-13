import React, { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  RadioGroup,
  Stack,
  FormControlLabel,
  Radio,
  Select,
  TextField,
} from '@/components/ui'
import { useBoundStore } from '@/store/useBoundStore'
import type { Goal, GoalTargetType } from '@/types'
import { SHARED_MESSAGES } from '@/constants/messages'
import { GOALS_CONTENT } from '../constants/content'

interface GoalFormProps {
  existingGoal?: Goal
  onSuccess?: () => void
}

export const GoalForm: React.FC<GoalFormProps> = ({ existingGoal, onSuccess }) => {
  const { habits, addGoal, updateGoal, showToast } = useBoundStore()
  const [habitId, setHabitId] = useState<number | ''>(existingGoal?.habitId ?? '')
  const [targetType, setTargetType] = useState<GoalTargetType>(existingGoal?.targetType || 'streak')
  const [targetValue, setTargetValue] = useState(existingGoal?.targetValue?.toString() || '')
  const [errors, setErrors] = useState<{
    habitId?: string
    targetType?: string
    targetValue?: string
  }>({})

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    if (!habitId) {
      newErrors.habitId = SHARED_MESSAGES.GOALS.VALIDATION_ALL_REQUIRED
    }

    if (!targetValue) {
      newErrors.targetValue = SHARED_MESSAGES.GOALS.VALIDATION_ALL_REQUIRED
    } else if (!Number.isInteger(Number(targetValue)) || Number(targetValue) <= 0) {
      newErrors.targetValue = SHARED_MESSAGES.GOALS.VALIDATION_INTEGER
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (): void => {
    if (!validateForm()) return

    const goalData = {
      habitId: habitId as number,
      targetType,
      targetValue: Number(targetValue),
      status: 'active' as const,
    }

    if (existingGoal) {
      updateGoal(existingGoal.id, goalData)
      showToast(SHARED_MESSAGES.SUCCESS.UPDATE, 'success')
    } else {
      addGoal(goalData)
      showToast(SHARED_MESSAGES.SUCCESS.CREATE, 'success')
    }

    setHabitId('')
    setTargetType('streak')
    setTargetValue('')
    setErrors({})
    onSuccess?.()
  }

  const isEditing = !!existingGoal

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: 2,
        p: 3,
        boxShadow: 1,
      }}
    >
      <Stack spacing={2}>
        <FormControl fullWidth error={!!errors.habitId}>
          <FormLabel sx={{ mb: 1, fontWeight: 600 }}>{GOALS_CONTENT.FORM_LABELS.HABIT}</FormLabel>
          <Select
            value={habitId}
            onChange={(e) => {
              setHabitId(Number(e.target.value))
              if (e.target.value) {
                setErrors((prev) => ({ ...prev, habitId: '' }))
              }
            }}
            disabled={isEditing}
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
          <FormLabel sx={{ mb: 1, fontWeight: 600 }}>
            {GOALS_CONTENT.FORM_LABELS.TARGET_TYPE}
          </FormLabel>
          <RadioGroup
            value={targetType}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTargetType(e.target.value as GoalTargetType)
            }
          >
            <FormControlLabel
              value="streak"
              control={<Radio />}
              label={GOALS_CONTENT.TARGET_TYPES.STREAK}
            />
            <FormControlLabel
              value="total_completions"
              control={<Radio />}
              label={GOALS_CONTENT.TARGET_TYPES.TOTAL_COMPLETIONS}
            />
          </RadioGroup>
        </FormControl>

        <FormControl fullWidth error={!!errors.targetValue}>
          <FormLabel sx={{ mb: 1, fontWeight: 600 }}>
            {GOALS_CONTENT.FORM_LABELS.TARGET_VALUE}
          </FormLabel>
          <TextField
            type="number"
            value={targetValue}
            onChange={(e) => {
              setTargetValue(e.target.value)
              if (
                e.target.value &&
                Number.isInteger(Number(e.target.value)) &&
                Number(e.target.value) > 0
              ) {
                setErrors((prev) => ({ ...prev, targetValue: '' }))
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
          {isEditing ? GOALS_CONTENT.FORM_SUBMIT_EDIT : GOALS_CONTENT.FORM_SUBMIT_ADD}
        </Button>
      </Stack>
    </Box>
  )
}

export default GoalForm
