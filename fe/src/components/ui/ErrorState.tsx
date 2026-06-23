import React from 'react'
import { Box, Typography, Card, Button } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { pxToRem } from '@/utils'
import { alpha } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

const DEFAULT_MESSAGE = 'Đã có lỗi xảy ra'
const ERROR_TITLE = 'Đã xảy ra lỗi!'
const RETRY_BUTTON_TEXT = 'Thử lại'

export const ErrorState: React.FC<ErrorStateProps> = ({ message = DEFAULT_MESSAGE, onRetry }) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      window.location.reload()
    }
  }

  return (
    <Card
      sx={{
        border: '1px solid',
        borderColor: (theme: Theme) => alpha(theme.palette.error.main, 0.3),
        bgcolor: (theme: Theme) => alpha(theme.palette.error.main, 0.05),
        textAlign: 'center',
        maxWidth: pxToRem(448),
        mx: 'auto',
        boxShadow: 1,
        p: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <Box
          sx={{
            p: 1.5,
            borderRadius: '50%',
            bgcolor: (theme: Theme) => alpha(theme.palette.error.main, 0.1),
            display: 'inline-flex',
          }}
        >
          <Icons.WarningAmber sx={{ fontSize: 24, color: 'error.main' }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: 'error.main',
              fontSize: pxToRem(16),
            }}
          >
            {ERROR_TITLE}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: pxToRem(14),
            }}
          >
            {message}
          </Typography>
        </Box>
        <Button variant="contained" color="error" size="small" onClick={handleRetry} sx={{ mt: 1 }}>
          {RETRY_BUTTON_TEXT}
        </Button>
      </Box>
    </Card>
  )
}
