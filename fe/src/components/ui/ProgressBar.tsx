import React from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { pxToRem } from '@/utils'

const PERCENT_SUFFIX = '%'
const VARIANT_DETERMINATE = 'determinate'
const TYPOGRAPHY_VARIANT_BODY2 = 'body2'
const TYPOGRAPHY_COLOR_TEXT_SECONDARY = 'text.secondary'

export interface ProgressBarProps {
  value: number
  showLabel?: boolean
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error'
  height?: number
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  showLabel = true,
  color = 'primary',
  height = 8,
}) => {
  const boundedValue = Math.min(100, Math.max(0, value))
  const percentText = `${Math.round(boundedValue)}${PERCENT_SUFFIX}`

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress
          variant={VARIANT_DETERMINATE}
          value={boundedValue}
          color={color}
          sx={{
            height: pxToRem(height),
            borderRadius: pxToRem(height / 2),
            bgcolor: 'divider',
          }}
        />
      </Box>
      {showLabel && (
        <Box sx={{ minWidth: 35 }}>
          <Typography variant={TYPOGRAPHY_VARIANT_BODY2} color={TYPOGRAPHY_COLOR_TEXT_SECONDARY}>
            {percentText}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default ProgressBar
