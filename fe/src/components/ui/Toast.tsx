import React, { useCallback, useEffect, useRef, useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { useBoundStore } from '@/store/useBoundStore'

const TOAST_DURATION_MS = 4000
const EXIT_ANIMATION_MS = 300

export const Toast: React.FC = () => {
  const toastQueue = useBoundStore((s) => s.toastQueue)
  const dismissToast = useBoundStore((s) => s.dismissToast)
  const current = toastQueue[0] ?? null

  const [open, setOpen] = useState(false)
  const autoCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const exitRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearAutoClose = useCallback(() => {
    if (autoCloseRef.current !== null) {
      clearTimeout(autoCloseRef.current)
      autoCloseRef.current = null
    }
  }, [])

  const triggerClose = useCallback(() => {
    clearAutoClose()
    setOpen(false)
    exitRef.current = setTimeout(dismissToast, EXIT_ANIMATION_MS)
  }, [clearAutoClose, dismissToast])

  const scheduleAutoClose = useCallback(() => {
    clearAutoClose()
    autoCloseRef.current = setTimeout(triggerClose, TOAST_DURATION_MS)
  }, [clearAutoClose, triggerClose])

  useEffect(() => {
    if (!current) return
    setOpen(true)
    scheduleAutoClose()
    return () => {
      clearAutoClose()
      if (exitRef.current !== null) {
        clearTimeout(exitRef.current)
        exitRef.current = null
      }
    }
  }, [current?.id, scheduleAutoClose, clearAutoClose])

  if (!current) return null

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      onMouseEnter={clearAutoClose}
      onMouseLeave={scheduleAutoClose}
    >
      <Alert
        onClose={triggerClose}
        severity={current.severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {current.message}
      </Alert>
    </Snackbar>
  )
}
