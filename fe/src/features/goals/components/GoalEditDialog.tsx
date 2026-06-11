import React, { useState } from 'react'
import {
  Box,
  Stack,
  FormControl,
  FormLabel,
  FormHelperText,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@/components/ui'
import { useBoundStore } from '@/store/useBoundStore'
import type { Goal, TargetType } from '@/types'
import { GOALS_CONTENT } from '../constants/content'

const TARGET_VALUE_STREAK = 'streak'
const TARGET_VALUE_TOTAL = 'total_completions'

interface GoalEditDialogProps {
  goal: Goal | null
  open: boolean
  onClose: () => void
}

export const GoalEditDialog: React.FC<GoalEditDialogProps> = ({ goal, open, onClose }) => {
  const habits = useBoundStore((s) => s.habits)
  const updateGoal = useBoundStore((s) => s.updateGoal)

  const [targetType, setTargetType] = useState<TargetType>(goal?.targetType ?? 'streak')
  const [targetValue, setTargetValue] = useState(goal?.targetValue?.toString() ?? '')
  const [errors, setErrors] = useState<{ targetValue?: string }>({})

  const habitName =
    habits.find((h) => h.id === goal?.habitId)?.name ?? GOALS_CONTENT.UNKNOWN_HABIT

  const validate = (): boolean => {
    const next: typeof errors = {}
    if (!targetValue || !Number.isInteger(Number(targetValue)) || Number(targetValue) <= 0) {
      next.targetValue = GOALS_CONTENT.VALIDATION.TARGET_INTEGER
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = () => {
    if (!validate() || !goal) return
    updateGoal(goal.id, { targetType, targetValue: Number(targetValue) })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{GOALS_CONTENT.FORM_TITLE_EDIT}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Box sx={{ p: 1.5, borderRadius: 1, bgcolor: 'action.hover' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {GOALS_CONTENT.FORM_LABELS.HABIT}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {habitName}
            </Typography>
          </Box>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1, fontWeight: 600 }}>
              {GOALS_CONTENT.FORM_LABELS.TARGET_TYPE}
            </FormLabel>
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
            <FormLabel sx={{ mb: 1, fontWeight: 600 }}>
              {GOALS_CONTENT.FORM_LABELS.TARGET_VALUE}
            </FormLabel>
            <TextField
              type="number"
              value={targetValue}
              onChange={(e) => {
                setTargetValue(e.target.value)
                if (Number.isInteger(Number(e.target.value)) && Number(e.target.value) > 0) {
                  setErrors({})
                }
              }}
              error={!!errors.targetValue}
              slotProps={{ htmlInput: { step: 1, min: 1 } }}
            />
            {errors.targetValue && <FormHelperText>{errors.targetValue}</FormHelperText>}
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          {GOALS_CONTENT.FORM_CANCEL}
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {GOALS_CONTENT.FORM_SUBMIT_EDIT}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
