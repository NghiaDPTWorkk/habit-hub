import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ProgressBar from './ProgressBar'

const TYPOGRAPHY_VARIANT_SUBTITLE2 = 'subtitle2'
const COLOR_TEXT_PRIMARY = 'text.primary'

export interface MiniChartItem {
  label: string
  value: number
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
}

export interface MiniChartProps {
  data: MiniChartItem[]
}

export const MiniChart: React.FC<MiniChartProps> = ({ data }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
      {data.map((item, index) => {
        const keyVal = `${item.label}-${index}`
        return (
          <Box key={keyVal}>
            <Typography
              variant={TYPOGRAPHY_VARIANT_SUBTITLE2}
              color={COLOR_TEXT_PRIMARY}
              sx={{ mb: 0.5, fontWeight: 600 }}
            >
              {item.label}
            </Typography>
            <ProgressBar value={item.value} color={item.color} />
          </Box>
        )
      })}
    </Box>
  )
}

export default MiniChart
