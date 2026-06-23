import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import Card from './Card'
import type { CardProps } from './Card'
import { pxToRem } from '@/utils'

const VARIANT_BODY2 = 'body2'
const COLOR_TEXT_SECONDARY = 'text.secondary'
const COLOR_TEXT_PRIMARY = 'text.primary'
const COLOR_SUCCESS_MAIN = 'success.main'
const COLOR_ERROR_MAIN = 'error.main'
const BORDER_STYLE_SOLID = 'solid'

export interface StatCardProps extends CardProps {
  title: string
  value: string | number
  trend?: string
  trendDirection?: 'up' | 'down'
  icon?: React.ReactNode
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  trendDirection = 'up',
  icon,
  color = 'primary',
  sx,
  ...props
}) => {
  return (
    <Card
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeft: (t) => `${pxToRem(4)} ${BORDER_STYLE_SOLID} ${t.palette[color].main}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: (t) => `0 ${pxToRem(12)} ${pxToRem(28)} ${alpha(t.palette[color].main, 0.12)}`,
        },
        ...sx,
      }}
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
      {icon && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: pxToRem(44),
            height: pxToRem(44),
            borderRadius: pxToRem(12),
            background: (t) => alpha(t.palette[color].main, 0.1),
            color: (t) => t.palette[color].main,
            border: (t) =>
              `${pxToRem(1)} ${BORDER_STYLE_SOLID} ${alpha(t.palette[color].main, 0.2)}`,
            boxShadow: (t) => `0 0 ${pxToRem(12)} ${alpha(t.palette[color].main, 0.08)}`,
          }}
        >
          {icon}
        </Box>
      )}
    </Card>
  )
}

export default StatCard
