import React from 'react'
import { Snackbar, Alert } from '@mui/material'
import { useBoundStore } from '@/store'

const TOAST_DURATION_MS = 3000

export const Toast: React.FC = () => {
  const toast = useBoundStore((s) => s.toast)
  const hideToast = useBoundStore((s) => s.hideToast)

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return
    hideToast()
  }

  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={TOAST_DURATION_MS}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={hideToast} severity={toast.severity} variant="filled" sx={{ width: '100%' }}>
        {toast.message}
      </Alert>
    </Snackbar>
  )
}