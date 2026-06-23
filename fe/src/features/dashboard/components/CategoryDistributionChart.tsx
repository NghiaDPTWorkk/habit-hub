import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Box, Typography, Card } from '@/components/ui'
import { theme } from '@/theme'
import { useWeeklyCategoryStats } from '../hooks'
import type { Category } from '@/types'
import { alpha } from '@mui/material/styles'

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
const VARIANT_SUBTITLE1 = 'subtitle1'
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
  const hasData = data.length > 0
  const chartData = hasData ? data : [{ name: 'No data', value: 1 }]

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant={VARIANT_SUBTITLE1} sx={{ mb: 2, fontWeight: 700 }}>
        {CHART_TITLE}
      </Typography>

      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={INNER_RADIUS}
            outerRadius={OUTER_RADIUS}
            dataKey="value"
            paddingAngle={hasData ? 3 : 0}
            isAnimationActive={hasData}
          >
            {chartData.map((entry) => {
              const fill = hasData
                ? (CATEGORY_COLORS[entry.name as Category] ?? DEFAULT_COLOR)
                : alpha(theme.palette.text.secondary, 0.15)
              return <Cell key={entry.name} fill={fill} />
            })}
          </Pie>
          {hasData && <Tooltip formatter={(value) => [`${value as number}`, TOOLTIP_LABEL]} />}
        </PieChart>
      </ResponsiveContainer>

      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {hasData ? (
          data.map((entry) => {
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
          })
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="span"
              style={{
                ...DOT_BASE_STYLE,
                backgroundColor: alpha(theme.palette.text.secondary, 0.15),
              }}
            />
            <Typography variant={VARIANT_CAPTION} color={COLOR_TEXT_SECONDARY}>
              {EMPTY_MESSAGE}
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  )
}
