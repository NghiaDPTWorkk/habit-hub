import React from 'react'
import Grid from '@mui/material/Grid'
import { Box, Card, Typography, Tooltip } from '@/components/ui'
import TimelineIcon from '@mui/icons-material/Timeline'
import { useBoundStore } from '@/store'
import { isScheduledForDate } from '@/features/habits/services/ScheduleService'
import { useTheme } from '@mui/material/styles'
import { pxToRem } from '@/utils'
import { WeeklyTrendTooltip } from './WeeklyTrendTooltip'
import type { DayTrendData } from './WeeklyTrendTooltip'

interface WeeklyTrendChartProps {
  filterCategory: string
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const toLocalDateStr = (d: Date) => d.toLocaleDateString('en-CA')

const LIGHT_BG = '#e6f4ea'
const DARK_BG = 'rgba(52, 211, 153, 0.12)'
const LIGHT_BORDER = '#b7e1cd'
const DARK_BORDER = 'rgba(52, 211, 153, 0.25)'

const TITLE_TREND = '7-Day Trend'
const LABEL_BEST_DAY = 'Best Day'
const LABEL_COMPLETED = 'Completed'
const LABEL_7DAY_AVG = '7-Day Avg'
const TXT_AVG = 'Avg '
const TXT_PCT = '%'
const TXT_SLASH_7 = '/7'

export const WeeklyTrendChart: React.FC<WeeklyTrendChartProps> = ({ filterCategory }) => {
  const theme = useTheme()
  const habits = useBoundStore((s) => s.habits)
  const checkins = useBoundStore((s) => s.checkins)
  const [selectedIdx, setSelectedIdx] = React.useState<number>(6)

  const dates = React.useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (6 - i))
        return d
      }),
    []
  )

  const dayData = React.useMemo<DayTrendData[]>(() => {
    const active = habits.filter((h) => h.status === 'Active')
    const filtered =
      filterCategory === 'All' ? active : active.filter((h) => h.category === filterCategory)
    return dates.map((date) => {
      const dateStr = toLocalDateStr(date)
      const scheduled = filtered.filter((h) => isScheduledForDate(h, dateStr))
      const completed = scheduled.filter((h) =>
        Object.values(checkins).some(
          (c) => c.habitId === h.id && c.date === dateStr && c.status === 'Completed'
        )
      )
      return {
        date,
        dateStr,
        dayLabel: DAY_NAMES[date.getDay()],
        scheduled,
        completed,
        pending: scheduled.filter((h) => !completed.includes(h)),
        rate: scheduled.length === 0 ? 0 : completed.length / scheduled.length,
      }
    })
  }, [dates, habits, checkins, filterCategory])

  const rates = dayData.map((d) => d.rate)
  const maxRate = Math.max(...rates)
  const bestDay = maxRate > 0 ? dayData.find((d) => d.rate === maxRate)?.dayLabel : '—'
  const daysCompleted = rates.filter((r) => r > 0).length
  const avgRatePct = Math.round((rates.reduce((a, b) => a + b, 0) / 7) * 100)

  const svgW = 280,
    svgH = 160,
    padL = 28,
    padR = 8,
    padT = 18,
    padB = 26
  const chartW = svgW - padL - padR,
    chartH = svgH - padT - padB,
    baseY = padT + chartH
  const barGap = chartW / 7,
    barWidth = barGap * 0.52

  return (
    <Card sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TimelineIcon sx={{ color: 'primary.main' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {TITLE_TREND}
          </Typography>
        </Box>
        <Box
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: 20,
            bgcolor: theme.palette.mode === 'light' ? LIGHT_BG : DARK_BG,
            border: '1px solid',
            borderColor: theme.palette.mode === 'light' ? LIGHT_BORDER : DARK_BORDER,
            color: 'success.main',
            fontWeight: 600,
            fontSize: pxToRem(12),
          }}
        >
          {TXT_AVG}
          {avgRatePct}
          {TXT_PCT}
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: LABEL_BEST_DAY, value: bestDay },
          { label: LABEL_COMPLETED, value: `${daysCompleted}${TXT_SLASH_7}` },
          { label: LABEL_7DAY_AVG, value: `${avgRatePct}${TXT_PCT}` },
        ].map((m) => (
          <Grid key={m.label} size={{ xs: 4 }}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: 'background.default',
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mb: 0.5, fontWeight: 500 }}
              >
                {m.label}
              </Typography>
              <Typography variant="h6" color="success.main" sx={{ fontWeight: 700 }}>
                {m.value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          alignItems: 'stretch',
        }}
      >
        <Box sx={{ flex: 1.5, maxWidth: 400, minWidth: 280, mx: { xs: 'auto', md: 0 } }}>
          <svg
            viewBox={`0 0 ${svgW} ${svgH}`}
            width="100%"
            height="auto"
            style={{ display: 'block', overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.palette.primary.main} />
                <stop offset="100%" stopColor={theme.palette.primary.dark} />
              </linearGradient>
            </defs>
            {[0, 0.5, 1].map((pct) => {
              const gy = baseY - pct * chartH
              return (
                <g key={pct}>
                  <line
                    x1={padL}
                    x2={svgW - padR}
                    y1={gy}
                    y2={gy}
                    stroke={theme.palette.divider}
                    strokeWidth={1}
                    strokeDasharray={pct === 0 ? undefined : '3 3'}
                  />
                  <text
                    x={padL - 4}
                    y={gy + 3}
                    fontSize="8px"
                    textAnchor="end"
                    fill={theme.palette.text.secondary}
                  >
                    {Math.round(pct * 100)}
                    {TXT_PCT}
                  </text>
                </g>
              )
            })}
            {dayData.map((d, index) => {
              const isToday = index === 6
              const barH = Math.max(d.rate > 0 ? 4 : 0, Math.floor(d.rate * chartH))
              const bx = padL + index * barGap + (barGap - barWidth) / 2
              const by = baseY - barH
              return (
                <Tooltip
                  key={d.dateStr}
                  title={<WeeklyTrendTooltip d={d} isToday={isToday} />}
                  arrow
                >
                  <g style={{ cursor: 'pointer' }} onClick={() => setSelectedIdx(index)}>
                    <rect
                      x={bx - 2}
                      y={padT - 2}
                      width={barWidth + 4}
                      height={chartH + 4}
                      rx={4}
                      fill="transparent"
                      stroke={index === selectedIdx ? theme.palette.primary.main : 'transparent'}
                      strokeWidth={1}
                    />
                    <rect
                      x={bx}
                      y={padT}
                      width={barWidth}
                      height={chartH}
                      rx={4}
                      fill={theme.palette.divider}
                      opacity={0.3}
                    />
                    <rect
                      x={bx}
                      y={by}
                      width={barWidth}
                      height={barH}
                      rx={4}
                      fill={isToday ? 'url(#barGrad)' : theme.palette.primary.main}
                      opacity={isToday ? 1 : 0.8}
                      style={{ transition: 'all 0.3s ease-in-out' }}
                    />
                    {d.rate > 0 && (
                      <text
                        x={bx + barWidth / 2}
                        y={by - 5}
                        fontSize="8px"
                        textAnchor="middle"
                        fill={isToday ? theme.palette.primary.main : theme.palette.text.primary}
                        fontWeight="600"
                      >
                        {Math.round(d.rate * 100)}
                        {TXT_PCT}
                      </text>
                    )}
                    <text
                      x={bx + barWidth / 2}
                      y={baseY + 12}
                      fontSize="9px"
                      textAnchor="middle"
                      fill={isToday ? theme.palette.primary.main : theme.palette.text.secondary}
                      fontWeight={isToday ? '700' : '400'}
                    >
                      {d.dayLabel}
                    </text>
                    {isToday && (
                      <circle
                        cx={bx + barWidth / 2}
                        cy={baseY + 22}
                        r={2.5}
                        fill={theme.palette.primary.main}
                      />
                    )}
                    <rect
                      x={bx - (barGap - barWidth) / 4}
                      y={padT}
                      width={barWidth + (barGap - barWidth) / 2}
                      height={chartH}
                      fill="transparent"
                    />
                  </g>
                </Tooltip>
              )
            })}
          </svg>
        </Box>

        <Box
          sx={{
            flex: 1,
            minWidth: 200,
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <WeeklyTrendTooltip d={dayData[selectedIdx]} isToday={selectedIdx === 6} />
        </Box>
      </Box>
    </Card>
  )
}

export default WeeklyTrendChart
