import React, { useState, useEffect } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { Dialog, IconButton, LinearProgress, Typography, Box, alpha } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { useBoundStore } from '@/store/useBoundStore'
import { Icons } from '@/components/ui/icons'
import { keyframes } from '@mui/system'
import type { ToastItem } from '@/store/toastSlice'
import { pxToRem } from '@/utils'
import type { Theme } from '@mui/material/styles'

const TOAST_DURATION_MS = 5000
const CELEBRATION_DURATION = 8000

const GOAL_COMPLETED_TEXT = 'Goal Completed!'
const ALMOST_THERE_TEXT = 'Almost There!'
const AWESOME_TEXT = 'Awesome!'

const pulseSuccess = keyframes`
  0% { transform: scale(1); filter: drop-shadow(0 0 0.125rem rgba(242, 153, 74, 0.4)); }
  50% { transform: scale(1.12); filter: drop-shadow(0 0 1.25rem rgba(242, 153, 74, 0.8)); }
  100% { transform: scale(1); filter: drop-shadow(0 0 0.125rem rgba(242, 153, 74, 0.4)); }
`

const pulseInfo = keyframes`
  0% { transform: scale(1); filter: drop-shadow(0 0 0.125rem rgba(9, 105, 218, 0.4)); }
  50% { transform: scale(1.12); filter: drop-shadow(0 0 1.25rem rgba(9, 105, 218, 0.8)); }
  100% { transform: scale(1); filter: drop-shadow(0 0 0.125rem rgba(9, 105, 218, 0.4)); }
`

const bounceIn = keyframes`
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.05); opacity: 0.8; }
  70% { transform: scale(0.9); opacity: 0.9; }
  100% { transform: scale(1); opacity: 1; }
`

interface CelebrationModalProps {
  current: ToastItem
  dismissToast: () => void
}

const CelebrationModal: React.FC<CelebrationModalProps> = ({ current, dismissToast }) => {
  const [paused, setPaused] = useState(false)
  const [timeLeft, setTimeLeft] = useState(CELEBRATION_DURATION)

  useEffect(() => {
    if (paused) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) {
          clearInterval(timer)
          dismissToast()
          return 0
        }
        return prev - 100
      })
    }, 100)

    return () => clearInterval(timer)
  }, [paused, dismissToast])

  const isSuccess = current.severity === 'success'
  const titleText = isSuccess ? GOAL_COMPLETED_TEXT : ALMOST_THERE_TEXT
  const titleColor = isSuccess ? 'success.main' : 'info.main'
  const iconPulse = isSuccess ? pulseSuccess : pulseInfo
  const autoCloseMessage = `Auto-closing in ${Math.ceil(timeLeft / 1000)}s...`

  return (
    <Dialog
      open
      onClose={dismissToast}
      maxWidth="xs"
      fullWidth
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
          },
        },
        paper: {
          sx: {
            borderRadius: 4,
            p: 4,
            textAlign: 'center',
            overflow: 'hidden',
            border: '1px solid',
            borderColor: isSuccess ? 'success.light' : 'info.light',
            bgcolor: (theme: Theme) => alpha(theme.palette.background.paper, 0.95),
            boxShadow: '0 1.5rem 3rem rgba(0,0,0,0.15)',
            position: 'relative',
            animation: `${bounceIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)`,
          },
        },
      }}
    >
      <Box
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 1 }}
      >
        <IconButton
          onClick={dismissToast}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            color: 'text.secondary',
            opacity: 0.7,
            '&:hover': { opacity: 1, bgcolor: 'action.hover' },
          }}
        >
          <Icons.Close fontSize="small" />
        </IconButton>

        {isSuccess ? (
          <Icons.EmojiEvents
            sx={{
              fontSize: 84,
              color: 'warning.main',
              mb: 3,
              animation: `${iconPulse} 2s infinite ease-in-out`,
            }}
          />
        ) : (
          <Icons.TrendingUp
            sx={{
              fontSize: 84,
              color: 'info.main',
              mb: 3,
              animation: `${iconPulse} 2s infinite ease-in-out`,
            }}
          />
        )}

        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: titleColor,
            mb: 1.5,
          }}
        >
          {titleText}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            color: 'text.primary',
            px: 2,
            mb: 4,
            lineHeight: 1.5,
          }}
        >
          {current.message}
        </Typography>

        <Button
          variant="contained"
          color={isSuccess ? 'success' : 'primary'}
          onClick={dismissToast}
          fullWidth
          sx={{
            borderRadius: 2,
            py: 1.5,
            fontWeight: 600,
            fontSize: pxToRem(16),
            boxShadow: (theme: Theme) =>
              isSuccess
                ? `0 0.5rem 1.25rem ${alpha(theme.palette.success.main, 0.25)}`
                : `0 0.5rem 1.25rem ${alpha(theme.palette.primary.main, 0.25)}`,
            textTransform: 'none',
            mb: 3,
          }}
        >
          {AWESOME_TEXT}
        </Button>

        <Box sx={{ width: '100%', px: 1 }}>
          <LinearProgress
            variant="determinate"
            value={(timeLeft / CELEBRATION_DURATION) * 100}
            color={isSuccess ? 'success' : 'primary'}
            sx={{
              height: 4,
              borderRadius: 2,
              bgcolor: 'action.hover',
              mb: 1,
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            {autoCloseMessage}
          </Typography>
        </Box>
      </Box>
    </Dialog>
  )
}

export const Toast: React.FC = () => {
  const toastQueue = useBoundStore((s) => s.toastQueue)
  const dismissToast = useBoundStore((s) => s.dismissToast)
  const current = toastQueue[0] ?? null
  const [paused, setPaused] = useState(false)

  if (!current) return null

  if (current.isGoalCelebration) {
    return <CelebrationModal key={current.id} current={current} dismissToast={dismissToast} />
  }

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
