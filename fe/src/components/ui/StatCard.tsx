import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from './Card'
import type { CardProps } from './Card'

const VARIANT_BODY2 = 'body2'
const COLOR_TEXT_SECONDARY = 'text.secondary'
const COLOR_TEXT_PRIMARY = 'text.primary'
const COLOR_SUCCESS_MAIN = 'success.main'
const COLOR_ERROR_MAIN = 'error.main'

export interface StatCardProps extends CardProps {
  title: string
  value: string | number
  trend?: string
  trendDirection?: 'up' | 'down'
  icon?: React.ReactNode
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  trendDirection = 'up',
  icon,
  sx,
  ...props
}) => {
  return (
    <Card
      sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...sx }}
      {...props}
    >
      <Box>
        <Typography
          variant={VARIANT_BODY2}
          color={COLOR_TEXT_SECONDARY}
          sx={{ mb: 0.5, fontWeight: 500 }}
        >
          {title}
        </Typography>
        <Typography variant="h4" color={COLOR_TEXT_PRIMARY} sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
        {trend && (
          <Typography
            variant="caption"
            color={trendDirection === 'up' ? COLOR_SUCCESS_MAIN : COLOR_ERROR_MAIN}
            sx={{ fontWeight: 600 }}
          >
            {trend}
          </Typography>
        )}
      </Box>
      {icon && <Box sx={{ display: 'flex', color: 'primary.main', opacity: 0.8 }}>{icon}</Box>}
    </Card>
  )
}

export default StatCard
