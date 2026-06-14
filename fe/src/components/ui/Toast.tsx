import React, { useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { useBoundStore } from '@/store/useBoundStore'
import { alpha } from '@mui/material/styles'
import { pxToRem } from '@/utils'
import type { Theme } from '@mui/material/styles'

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
        onClose={dismissToast}
        sx={{
          borderRadius: 1,
          minWidth: { xs: '100%', sm: 320 },
          maxWidth: { xs: '100%', sm: 480 },
          alignItems: 'center',
          backdropFilter: 'blur(12px)',
          boxShadow: 3,
          border: '1px solid',
          bgcolor: (theme: Theme) => {
            const color = theme.palette[current.severity ?? 'info'].main
            return alpha(color, 0.08)
          },
          color: (theme: Theme) => {
            const color = theme.palette[current.severity ?? 'info'].main
            return theme.palette.mode === 'dark' ? theme.palette.text.primary : color
          },
          borderColor: (theme: Theme) => {
            const color = theme.palette[current.severity ?? 'info'].main
            return alpha(color, 0.25)
          },
          '& .MuiAlert-icon': {
            fontSize: 22,
            color: (theme: Theme) => theme.palette[current.severity ?? 'info'].main,
          },
          '& .MuiAlert-message': {
            fontWeight: 600,
            fontSize: pxToRem(14),
            lineHeight: 1.4,
          },
          '& .MuiAlert-action': {
            color: 'text.secondary',
            opacity: 0.8,
            '&:hover': {
              opacity: 1,
            },
          },
        }}
      >
        {current.message}
      </Alert>
    </Snackbar>
  )
}
