import React from 'react'
import { Box, LinearProgress, Typography } from '@/components/ui'
import { GOALS_CONTENT } from '../constants/content'

interface GoalProgressBarProps {
  value: number
}

const getBarColor = (value: number): string => {
  if (value >= 100) return 'success.main'
  if (value >= 50) return 'warning.main'
  return 'grey.400'
}

export const GoalProgressBar: React.FC<GoalProgressBarProps> = ({ value }) => (
  <Box sx={{ width: '100%' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {GOALS_CONTENT.PROGRESS_LABEL}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {Math.round(value)}
        {GOALS_CONTENT.PERCENTAGE_SUFFIX}
      </Typography>
    </Box>
    <LinearProgress
      variant="determinate"
      value={value}
      sx={{
        height: 8,
        borderRadius: 1,
        bgcolor: 'action.disabledBackground',
        '& .MuiLinearProgress-bar': {
          bgcolor: getBarColor(value),
          transition: 'transform 0.5s ease-in-out, background-color 0.3s ease',
        },
      }}
    />
  </Box>
)
