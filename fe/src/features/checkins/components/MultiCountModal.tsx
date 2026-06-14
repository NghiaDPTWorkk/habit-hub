import React, { useState } from 'react'
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@/components/ui'
import { Button, TextField } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { useCheckinStore } from '../hooks'

const MODAL_TITLE = 'Update Progress'
const LABEL_CONFIRM = 'Confirm'
const LABEL_CANCEL = 'Cancel'
const LABEL_TARGET = 'Target'
const ERROR_EXCEED = 'Count cannot exceed target'
const ERROR_NEGATIVE = 'Count cannot be negative'
const DIALOG_MAX_WIDTH = 'xs'
const VARIANT_CONTAINED = 'contained'
const COLOR_SECONDARY = 'secondary'
const VARIANT_BODY2 = 'body2'
const VARIANT_CAPTION = 'caption'
const COLOR_TEXT_SECONDARY = 'text.secondary'
const COLOR_ERROR = 'error.main'
const SIZE_SMALL = 'small'

export interface MultiCountModalProps {
  open: boolean
  onClose: () => void
  habitId: number
  habitName: string
  targetPerDay: number
  date: string
  currentCount: number
}

// Wrapper: unmounts content when closed so state always initializes fresh on open
export const MultiCountModal: React.FC<MultiCountModalProps> = (props) => {
  if (!props.open) return null
  return <MultiCountModalContent {...props} />
}

const MultiCountModalContent: React.FC<MultiCountModalProps> = ({
  onClose,
  habitId,
  habitName,
  targetPerDay,
  date,
  currentCount,
}) => {
  const { upsertCheckin } = useCheckinStore()
  const [count, setCount] = useState(currentCount)
  const [inputValue, setInputValue] = useState(String(currentCount))

  const isNegative = count < 0
  const isExceeded = count > targetPerDay
  const isInvalid = isNegative || isExceeded

  const handleIncrement = () => {
    if (count >= targetPerDay) return
    const next = count + 1
    setCount(next)
    setInputValue(String(next))
  }

  const handleDecrement = () => {
    if (count <= 0) return
    const next = count - 1
    setCount(next)
    setInputValue(String(next))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    if (raw !== '' && !/^\d+$/.test(raw)) return
    setInputValue(raw)
    setCount(raw === '' ? 0 : parseInt(raw, 10))
  }

  const handleConfirm = () => {
    if (isInvalid) return
    upsertCheckin(habitId, date, { completedCount: count })
    onClose()
  }

  const errorMessage = isNegative ? ERROR_NEGATIVE : isExceeded ? ERROR_EXCEED : ''
  const targetLabel = `${LABEL_TARGET}: ${targetPerDay}`

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth={DIALOG_MAX_WIDTH}>
      <DialogTitle>{habitName}</DialogTitle>
      <DialogContent>
        <Typography variant={VARIANT_BODY2} color={COLOR_TEXT_SECONDARY} sx={{ mb: 2 }}>
          {MODAL_TITLE}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <IconButton
            onClick={handleDecrement}
            disabled={count <= 0}
            size={SIZE_SMALL}
            aria-label="Decrease completion count"
          >
            <Icons.Remove />
          </IconButton>
          <TextField
            value={inputValue}
            onChange={handleInputChange}
            size={SIZE_SMALL}
            error={isInvalid}
            sx={{ width: 80, '& input': { textAlign: 'center' } }}
          />
          <IconButton
            onClick={handleIncrement}
            disabled={count >= targetPerDay}
            size={SIZE_SMALL}
            aria-label="Increase completion count"
          >
            <Icons.Add />
          </IconButton>
        </Box>
        {errorMessage ? (
          <Typography
            variant={VARIANT_CAPTION}
            color={COLOR_ERROR}
            sx={{ display: 'block', mb: 1 }}
          >
            {errorMessage}
          </Typography>
        ) : null}
        <Typography variant={VARIANT_CAPTION} color={COLOR_TEXT_SECONDARY}>
          {targetLabel}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color={COLOR_SECONDARY}>
          {LABEL_CANCEL}
        </Button>
        <Button onClick={handleConfirm} variant={VARIANT_CONTAINED} disabled={isInvalid}>
          {LABEL_CONFIRM}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
