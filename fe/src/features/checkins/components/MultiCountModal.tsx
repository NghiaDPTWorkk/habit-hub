import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Slider from '@mui/material/Slider'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { CloseIcon } from '@/components/ui/icons'
import type { Habit } from '@/types'
import { upsertCheckIn } from '@/services/CheckInsService'
import { getActiveGoal } from '@/services/GoalsService'
import { useToast } from '@/hooks/useToast'
import { AppError } from '@/domain/AppError'
import { today } from '@/utils/dateUtils'

const CANCEL_LABEL = 'Save'
const SAVE_LABEL = 'Save'
const NOTE_PLACEHOLDER = 'Any notes about this session?'

interface Props {
  open: boolean
  habit: Habit
  currentCount: number
  onClose: () => void
}

export function MultiCountModal({ open, habit, currentCount, onClose }: Props) {
  const toast = useToast()
  const [count, setCount] = useState(currentCount)
  const [note, setNote] = useState('')

  function handleSave() {
    try {
      const prevGoal = getActiveGoal(habit.id)
      upsertCheckIn({
        habitId: habit.id,
        date: today(),
        completedCount: count,
        note: note.trim() || null,
      })
      const newGoal = getActiveGoal(habit.id)
      if (newGoal && prevGoal?.lastThresholdNotified !== newGoal.lastThresholdNotified) {
        if (newGoal.lastThresholdNotified === 'ONE_HUNDRED') {
          toast.success('Goal achieved! 🎯')
        } else if (newGoal.lastThresholdNotified === 'EIGHTY') {
          toast.info('Almost there — keep going!')
        }
      }
      toast.success('Progress saved')
      onClose()
    } catch (err) {
      toast.error(err instanceof AppError ? err.message : 'Check-in failed')
    }
  }

  const countLabel = `${count} / ${habit.targetPerDay} today`
  const charCount = `${note.length}/200`

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontWeight: 700 }}>{habit.name}</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {count}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {countLabel}
          </Typography>
        </Box>

        <Slider
          min={0}
          max={habit.targetPerDay}
          step={1}
          value={count}
          onChange={(_, val) => setCount(val as number)}
          marks
          valueLabelDisplay="auto"
          sx={{ mb: 3 }}
        />

        <TextField
          label="Note (optional)"
          fullWidth
          multiline
          rows={2}
          size="small"
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 200))}
          helperText={charCount}
          placeholder={NOTE_PLACEHOLDER}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>{CANCEL_LABEL}</Button>
        <Button variant="contained" onClick={handleSave}>
          {SAVE_LABEL}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
