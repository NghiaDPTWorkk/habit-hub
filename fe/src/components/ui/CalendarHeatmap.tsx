import React from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { alpha, useTheme } from '@mui/material/styles'

export interface HeatmapDay {
  date: string
  count: number
}

export interface CalendarHeatmapProps {
  data: HeatmapDay[]
  weeks?: number
  onCellClick?: (date: string) => void
  activeDate?: string | null
  overdueDates?: string[]
  fluid?: boolean
  showLabels?: boolean
}

// Row 0 = Mon, Row 1 = Tue, ... Row 6 = Sun (week starts on Monday)
const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const CELL_SIZE = 16
const CELL_GAP = 4
const DAY_LABEL_WIDTH = 28

export const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({
  data,
  weeks = 12,
  onCellClick,
  activeDate,
  overdueDates,
  fluid = false,
  showLabels = false,
}) => {
  const theme = useTheme()

  const dataMap = React.useMemo(() => {
    const map = new Map<string, number>()
    data.forEach((item) => map.set(item.date, item.count))
    return map
  }, [data])

  const gridDays = React.useMemo(() => {
    const days: Date[] = []
    const today = new Date()
    const currentDayOfWeek = today.getDay() // 0=Sun … 6=Sat
    // Days since the most-recent Monday (Mon=0, Tue=1, … Sun=6)
    const daysSinceMonday = (currentDayOfWeek + 6) % 7
    const startOffset = weeks * 7 - 7 + daysSinceMonday
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - startOffset)
    for (let i = 0; i < weeks * 7; i++) {
      const current = new Date(startDate)
      current.setDate(startDate.getDate() + i)
      days.push(current)
    }
    return days
  }, [weeks])

  // Week number labels: W1 … W{weeks} (oldest → newest)
  const weekLabels = React.useMemo(
    () => Array.from({ length: weeks }, (_, i) => `W${i + 1}`),
    [weeks]
  )

  const formatDateString = (date: Date): string => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const getTooltipText = (dateStr: string, count: number): string => {
    const d = new Date(dateStr + 'T12:00:00')
    const label = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    return count === 0
      ? `${label} · No activity`
      : `${label} · ${count} habit${count === 1 ? '' : 's'} completed`
  }

  const getCellColor = (count: number): string => {
    if (count === 0) return theme.palette.divider
    if (count === 1) return alpha(theme.palette.primary.main, 0.3)
    if (count === 2) return alpha(theme.palette.primary.main, 0.6)
    return theme.palette.primary.main
  }

  const renderCell = (day: Date | undefined, weekIdx: number) => {
    if (!day) return <Box key={`e${weekIdx}`} sx={{ width: '100%', aspectRatio: '1' }} />
    const dateStr = formatDateString(day)
    const count = dataMap.get(dateStr) || 0
    const isSelected = dateStr === activeDate
    const isOverdue = overdueDates?.includes(dateStr)
    return (
      <Tooltip
        key={`c${weekIdx}`}
        title={getTooltipText(dateStr, count)}
        arrow
        slotProps={{
          popper: { modifiers: [{ name: 'preventOverflow', options: { boundary: 'window' } }] },
        }}
      >
        <Box
          onClick={() => onCellClick?.(dateStr)}
          sx={{
            width: '100%',
            aspectRatio: '1',
            borderRadius: 1,
            backgroundColor: getCellColor(count),
            cursor: onCellClick ? 'pointer' : 'default',
            outline: isSelected ? '2px solid' : 'none',
            outlineColor: 'text.primary',
            boxSizing: 'border-box',
            position: 'relative',
            transition: 'opacity 0.15s, transform 0.15s',
            '&:hover': { opacity: 0.75, transform: 'scale(1.15)', zIndex: 2 },
          }}
        >
          {isOverdue && (
            <Box
              sx={{
                position: 'absolute',
                top: -2,
                right: -2,
                width: 5,
                height: 5,
                borderRadius: '50%',
                backgroundColor: 'error.main',
                border: '1px solid',
                borderColor: 'background.paper',
                pointerEvents: 'none',
              }}
            />
          )}
        </Box>
      </Tooltip>
    )
  }

  // Full-width unified grid with week + day labels
  if (showLabels) {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `${DAY_LABEL_WIDTH}px repeat(${weeks}, 1fr)`,
          gridTemplateRows: `20px repeat(7, auto)`,
          gap: `${CELL_GAP}px`,
          width: '100%',
        }}
      >
        {/* Row 0: corner + week labels W1…W{weeks} */}
        <Box />
        {weekLabels.map((label, i) => (
          <Box
            key={`w${i}`}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: 9, fontWeight: 500 }}
            >
              {label}
            </Typography>
          </Box>
        ))}

        {/* Rows 1–7: Mon … Sun label + cells */}
        {Array.from({ length: 7 }, (_, dayIdx) => (
          <React.Fragment key={`row${dayIdx}`}>
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', pr: 0.5 }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: 10, lineHeight: 1 }}
              >
                {ALL_DAYS[dayIdx]}
              </Typography>
            </Box>
            {Array.from({ length: weeks }, (_, weekIdx) =>
              renderCell(gridDays[weekIdx * 7 + dayIdx], weekIdx)
            )}
          </React.Fragment>
        ))}
      </Box>
    )
  }

  // Default compact grid (fixed 16px cells)
  const colSize = fluid ? '1fr' : `${CELL_SIZE}px`
  const cellSx = { width: fluid ? '100%' : CELL_SIZE, height: fluid ? '100%' : CELL_SIZE }
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${weeks}, ${colSize})`,
        gridTemplateRows: fluid ? `repeat(7, 1fr)` : `repeat(7, ${CELL_SIZE}px)`,
        gridAutoFlow: 'column',
        gap: `${CELL_GAP}px`,
        width: fluid ? '100%' : 'fit-content',
        aspectRatio: fluid ? `${weeks} / 7` : 'auto',
      }}
    >
      {gridDays.map((day, index) => {
        const dateStr = formatDateString(day)
        const count = dataMap.get(dateStr) || 0
        const isSelected = dateStr === activeDate
        const isOverdue = overdueDates?.includes(dateStr)
        return (
          <Tooltip
            key={dateStr || index}
            title={getTooltipText(dateStr, count)}
            arrow
            slotProps={{
              popper: { modifiers: [{ name: 'preventOverflow', options: { boundary: 'window' } }] },
            }}
          >
            <Box
              onClick={() => onCellClick?.(dateStr)}
              sx={{
                ...cellSx,
                borderRadius: 0.5,
                backgroundColor: getCellColor(count),
                cursor: onCellClick ? 'pointer' : 'default',
                border: isSelected ? '2px solid' : 'none',
                borderColor: 'text.primary',
                boxSizing: 'border-box',
                position: 'relative',
                transition: 'all 0.2s',
                '&:hover': { opacity: 0.8, transform: 'scale(1.2)', zIndex: 2 },
              }}
            >
              {isOverdue && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    backgroundColor: 'error.main',
                    border: '1px solid',
                    borderColor: 'background.paper',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </Box>
          </Tooltip>
        )
      })}
    </Box>
  )
}

export default CalendarHeatmap
