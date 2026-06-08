import React from 'react'
import { Box, LinearProgress, Typography, useTheme } from '@/components/ui'

interface ProgressBarProps {
  value: number
  status: 'normal' | 'warning' | 'completed'
}

const PROGRESS_LABEL = 'Progress'
const PERCENTAGE_SUFFIX = '%'

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, status }) => {
  const theme = useTheme()

  const getColor = (): string => {
    switch (status) {
      case 'warning':
        return theme.palette.warning.main
      case 'completed':
        return theme.palette.success.main
      default:
        return theme.palette.primary.main
    }
  }

  const color = getColor()

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {PROGRESS_LABEL}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {Math.round(value)}
          {PERCENTAGE_SUFFIX}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 8,
          borderRadius: 1,
          backgroundColor: theme.palette.divider,
          '& .MuiLinearProgress-bar': {
            backgroundColor: color,
          },
        }}
      />
    </Box>
  )
}

export default ProgressBar
