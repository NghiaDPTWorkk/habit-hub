import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from './Button'

const DEFAULT_CONFIRM_TEXT = 'Confirm'
const DEFAULT_CANCEL_TEXT = 'Cancel'
const DIALOG_MAX_WIDTH_XS = 'xs'
const BUTTON_COLOR_SECONDARY = 'secondary'
const BUTTON_VARIANT_CONTAINED = 'contained'
const SEVERITY_ERROR = 'error'
const SEVERITY_WARNING = 'warning'

export interface ConfirmDialogProps {
  open: boolean
  title: string
  content: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onClose: () => void
  severity?: 'error' | 'warning' | 'info'
  loading?: boolean
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  content,
  confirmText = DEFAULT_CONFIRM_TEXT,
  cancelText = DEFAULT_CANCEL_TEXT,
  onConfirm,
  onClose,
  severity,
  loading = false,
}) => {
  let confirmColor: 'primary' | 'error' | 'warning' = 'primary'
  if (severity === SEVERITY_ERROR) {
    confirmColor = SEVERITY_ERROR
  } else if (severity === SEVERITY_WARNING) {
    confirmColor = SEVERITY_WARNING
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={DIALOG_MAX_WIDTH_XS}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color={BUTTON_COLOR_SECONDARY} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          loading={loading}
          variant={BUTTON_VARIANT_CONTAINED}
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
