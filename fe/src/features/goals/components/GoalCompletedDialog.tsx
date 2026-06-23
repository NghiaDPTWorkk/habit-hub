import React, { useState, useEffect } from 'react'
import { Dialog, Button, Typography, Box, IconButton, LinearProgress } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { keyframes } from '@mui/system'
import { alpha } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'

const CELEBRATION_DURATION = 7000

const pulseSuccess = keyframes`
  0% { transform: scale(1); filter: drop-shadow(0 0 0.125rem rgba(46, 125, 50, 0.4)); }
  50% { transform: scale(1.12); filter: drop-shadow(0 0 1.25rem rgba(46, 125, 50, 0.8)); }
  100% { transform: scale(1); filter: drop-shadow(0 0 0.125rem rgba(46, 125, 50, 0.4)); }
`

const pulseWarning = keyframes`
  0% { transform: scale(1); filter: drop-shadow(0 0 0.125rem rgba(237, 108, 2, 0.4)); }
  50% { transform: scale(1.12); filter: drop-shadow(0 0 1.25rem rgba(237, 108, 2, 0.8)); }
  100% { transform: scale(1); filter: drop-shadow(0 0 0.125rem rgba(237, 108, 2, 0.4)); }
`

const bounceIn = keyframes`
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.05); opacity: 0.8; }
  70% { transform: scale(0.9); opacity: 0.9; }
  100% { transform: scale(1); opacity: 1; }
`

const CONTENT = {
  '100': {
    title: 'Goal Complete!',
    subtitle: 'You reached your target for',
    button: 'Awesome!',
    color: 'success' as const,
    borderColor: 'success.light',
    pulse: pulseSuccess,
    icon: 'trophy' as const,
  },
  '80': {
    title: 'Almost There!',
    subtitle: "You're 80% of the way to your goal for",
    button: 'Keep it up!',
    color: 'warning' as const,
    borderColor: 'warning.light',
    pulse: pulseWarning,
    icon: 'trending' as const,
  },
}

interface GoalCompletedDialogProps {
  habitName: string | null
  onClose: () => void
  type?: '80' | '100'
}

export const GoalCompletedDialog: React.FC<GoalCompletedDialogProps> = ({
  habitName,
  onClose,
  type = '100',
}) => {
  const content = CONTENT[type]
  const [timeLeft, setTimeLeft] = useState(CELEBRATION_DURATION)

  useEffect(() => {
    if (!habitName) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) {
          clearInterval(timer)
          onClose()
          return 0
        }
        return prev - 100
      })
    }, 100)

    return () => clearInterval(timer)
  }, [habitName, onClose])

  if (!habitName) return null

  const secondsVal = Math.ceil(timeLeft / 1000)
  const autoCloseMessage = `Auto-closing in ${secondsVal}s...`

  return (
    <Dialog
      open
      onClose={onClose}
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
            borderColor: content.borderColor,
            bgcolor: (theme: Theme) => alpha(theme.palette.background.paper, 0.95),
            boxShadow: '0 1.5rem 3rem rgba(0,0,0,0.15)',
            position: 'relative',
            animation: `${bounceIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)`,
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <IconButton
          onClick={onClose}
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

        <Box
          sx={{
            mb: 3,
            width: 72,
            height: 72,
            borderRadius: '50%',
            bgcolor: `${content.color}.main`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: (theme: Theme) => {
              const mainColor = theme.palette[content.color].main
              return `0 0.5rem 1.5rem ${alpha(mainColor, 0.35)}`
            },
            animation: `${content.pulse} 2s infinite ease-in-out`,
          }}
        >
          {content.icon === 'trophy' ? (
            <Icons.EmojiEvents sx={{ fontSize: 38 }} />
          ) : (
            <Icons.TrendingUp sx={{ fontSize: 38 }} />
          )}
        </Box>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: `${content.color}.main`,
            mb: 1.5,
          }}
        >
          {content.title}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            mb: 0.5,
          }}
        >
          {content.subtitle}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 4,
          }}
        >
          {habitName}
        </Typography>

        <Button
          variant="contained"
          color={content.color}
          onClick={onClose}
          fullWidth
          sx={{
            borderRadius: 2,
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            mb: 3,
            boxShadow: (theme: Theme) => {
              const mainColor = theme.palette[content.color].main
              return `0 0.5rem 1.25rem ${alpha(mainColor, 0.25)}`
            },
          }}
        >
          {content.button}
        </Button>

        <Box sx={{ width: '100%', px: 1 }}>
          <LinearProgress
            variant="determinate"
            value={(timeLeft / CELEBRATION_DURATION) * 100}
            color={content.color}
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
