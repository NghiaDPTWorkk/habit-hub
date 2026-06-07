import { useEffect } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import { useToastStore } from '@/hooks/useToast'

const AUTO_HIDE_MS = 4000

export function ToastProvider() {
  const { toasts, removeToast } = useToastStore()

  return (
    <Stack
      spacing={1}
      sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 2000 }}
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} onClose={() => removeToast(t.id)} />
      ))}
    </Stack>
  )
}

function ToastItem({
  id,
  type,
  message,
  onClose,
}: {
  id: string
  type: string
  message: string
  onClose: () => void
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, AUTO_HIDE_MS)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <Snackbar open anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Alert
        onClose={onClose}
        severity={type as 'success' | 'error' | 'info' | 'warning'}
        variant="filled"
        sx={{ minWidth: 280, boxShadow: 4 }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}
