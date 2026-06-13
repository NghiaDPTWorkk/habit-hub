import React, { useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { useBoundStore } from '@/store/useBoundStore'

const TOAST_DURATION_MS = 4000

export const Toast: React.FC = () => {
  const toastQueue = useBoundStore((s) => s.toastQueue)
  const dismissToast = useBoundStore((s) => s.dismissToast)
  const current = toastQueue[0] ?? null
  const [paused, setPaused] = useState(false)

  if (!current) return null

  return (
    <Snackbar
      key={current.id}
      open
      autoHideDuration={paused ? null : TOAST_DURATION_MS}
      onClose={(_e, reason) => {
        if (reason !== 'clickaway') dismissToast()
      }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Alert
        onClose={dismissToast}
        severity={current.severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {current.message}
      </Alert>
    </Snackbar>
  )
}
