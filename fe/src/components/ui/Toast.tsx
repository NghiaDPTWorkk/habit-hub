import React, { useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { useBoundStore } from '@/store/useBoundStore'

const TOAST_DURATION_MS = 5000

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
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ top: { xs: 16, sm: 24 }, width: { xs: '92%', sm: 'auto' } }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Alert
        severity={current.severity}
        variant="filled"
        onClose={dismissToast}
        sx={{
          borderRadius: 2,
          minWidth: { xs: '100%', sm: 300 },
          maxWidth: { xs: '100%', sm: 480 },
          alignItems: 'center',
          '& .MuiAlert-icon': { fontSize: 22 },
          '& .MuiAlert-message': { fontWeight: 500 },
        }}
      >
        {current.message}
      </Alert>
    </Snackbar>
  )
}
