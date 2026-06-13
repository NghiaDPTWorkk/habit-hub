import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Box, Typography, Card } from '@/components/ui'
import { theme } from '@/theme'
import { useWeeklyCategoryStats } from '../hooks'
import type { Category } from '@/types'

const CATEGORY_COLORS: Record<Category, string> = {
  Health: theme.palette.success.main,
  Study: theme.palette.info.main,
  Work: theme.palette.primary.main,
  Mindfulness: theme.palette.secondary.main,
  Other: theme.palette.warning.main,
}
const DEFAULT_COLOR = theme.palette.text.secondary

const CHART_TITLE = 'Category Distribution'
const EMPTY_MESSAGE = 'No check-in data for the past 7 days.'
const TOOLTIP_LABEL = 'Completions'
const VARIANT_H6 = 'h6'
const VARIANT_BODY2 = 'body2'
const VARIANT_CAPTION = 'caption'
const COLOR_TEXT_SECONDARY = 'text.secondary'

const CHART_HEIGHT = 200
const INNER_RADIUS = 50
const OUTER_RADIUS = 80
const DOT_SIZE = 12

const DOT_BASE_STYLE: React.CSSProperties = {
  width: DOT_SIZE,
  height: DOT_SIZE,
  borderRadius: '50%',
  flexShrink: 0,
}

export const CategoryDistributionChart: React.FC = () => {
  const data = useWeeklyCategoryStats()

  if (data.length === 0) {
    return (
      <Card sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant={VARIANT_H6} sx={{ mb: 2, fontWeight: 600 }}>
          {CHART_TITLE}
        </Typography>
        <Typography variant={VARIANT_BODY2} color={COLOR_TEXT_SECONDARY}>
          {EMPTY_MESSAGE}
        </Typography>
      </Card>
    )
  }

  return (
    <Card sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Typography variant={VARIANT_H6} sx={{ mb: 2, fontWeight: 600 }}>
        {CHART_TITLE}
      </Typography>

      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={INNER_RADIUS}
            outerRadius={OUTER_RADIUS}
            dataKey="value"
            paddingAngle={3}
          >
            {data.map((entry) => {
              const fill = CATEGORY_COLORS[entry.name as Category] ?? DEFAULT_COLOR
              return <Cell key={entry.name} fill={fill} />
            })}
          </Pie>
          <Tooltip formatter={(value) => [`${value as number}`, TOOLTIP_LABEL]} />
        </PieChart>
      </ResponsiveContainer>

      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {data.map((entry) => {
          const label = `${entry.name} (${entry.percentage}%)`
          const dotColor = CATEGORY_COLORS[entry.name as Category] ?? DEFAULT_COLOR
          return (
            <Box key={entry.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box component="span" style={{ ...DOT_BASE_STYLE, backgroundColor: dotColor }} />
              <Typography variant={VARIANT_CAPTION} color={COLOR_TEXT_SECONDARY}>
                {label}
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Card>
  )
}
