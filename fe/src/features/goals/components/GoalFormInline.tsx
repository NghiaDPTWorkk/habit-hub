import { useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import FormHelperText from '@mui/material/FormHelperText'
import type { TargetType, GoalInput } from '@/types'
import { TARGET_TYPE_LABELS } from '@/types'
import { createGoal } from '@/services/GoalsService'
import { useToast } from '@/hooks/useToast'
import { AppError } from '@/domain/AppError'
import { ERR } from '@/domain/errorCodes'

const CANCEL_LABEL = 'Cancel'
const SET_GOAL_LABEL = 'Set goal'

interface Props {
  habitId: string
  onCreated: () => void
  onCancel: () => void
}

export function GoalFormInline({ habitId, onCreated, onCancel }: Props) {
  const toast = useToast()
  const [targetType, setTargetType] = useState<TargetType>('STREAK')
  const [targetValue, setTargetValue] = useState(21)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit() {
    setError(null)
    const input: GoalInput = { targetType, targetValue }
    try {
      createGoal(habitId, input)
      toast.success('Goal created')
      onCreated()
    } catch (err) {
      if (err instanceof AppError) {
        if (err.code === ERR.GOAL.ACTIVE_EXISTS) {
          setError('An active goal already exists for this habit.')
        } else {
          setError(err.message)
        }
      } else {
        setError('Failed to create goal')
      }
    }
  }

  return (
    <Box>
      <Stack spacing={2}>
        <ToggleButtonGroup
          exclusive
          size="small"
          fullWidth
          value={targetType}
          onChange={(_, v) => v && setTargetType(v as TargetType)}
        >
          <ToggleButton value="STREAK">{TARGET_TYPE_LABELS.STREAK}</ToggleButton>
          <ToggleButton value="TOTAL_COMPLETIONS">
            {TARGET_TYPE_LABELS.TOTAL_COMPLETIONS}
          </ToggleButton>
        </ToggleButtonGroup>

        <TextField
          label={targetType === 'STREAK' ? 'Days streak' : 'Total completions'}
          type="number"
          size="small"
          value={targetValue}
          onChange={(e) => setTargetValue(Math.max(1, parseInt(e.target.value) || 1))}
          slotProps={{ htmlInput: { min: 1 } }}
          error={Boolean(error)}
        />
        {error && <FormHelperText error>{error}</FormHelperText>}

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button size="small" onClick={onCancel}>
            {CANCEL_LABEL}
          </Button>
          <Button size="small" variant="contained" onClick={handleSubmit}>
            {SET_GOAL_LABEL}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}
