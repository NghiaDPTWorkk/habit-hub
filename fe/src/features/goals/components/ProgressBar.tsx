import React from 'react'
import { Box, LinearProgress, Typography, useTheme } from '@/components/ui'

interface ProgressBarProps {
  value: number
}

const PROGRESS_LABEL = 'Progress'
const PERCENTAGE_SUFFIX = '%'

export const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  const theme = useTheme()

  const getColor = (): string => {
    if (value >= 100) return theme.palette.success.main
    if (value >= 50) return theme.palette.warning.main
    return theme.palette.grey[400]
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
            transition: 'transform 0.5s ease-in-out, background-color 0.3s ease',
          },
        }}
      />
    </Box>
  )
}

export default ProgressBar
