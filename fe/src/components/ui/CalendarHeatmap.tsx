import React from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
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
}

export const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({
  data,
  weeks = 12,
  onCellClick,
  activeDate,
  overdueDates,
}) => {
  const theme = useTheme()

  const dataMap = React.useMemo(() => {
    const map = new Map<string, number>()
    data.forEach((item) => {
      map.set(item.date, item.count)
    })
    return map
  }, [data])

  const gridDays = React.useMemo(() => {
    const days: Date[] = []
    const today = new Date()
    const currentDayOfWeek = today.getDay()
    const startOffset = weeks * 7 - 7 + currentDayOfWeek
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - startOffset)

    for (let i = 0; i < weeks * 7; i++) {
      const current = new Date(startDate)
      current.setDate(startDate.getDate() + i)
      days.push(current)
    }
    return days
  }, [weeks])

  const getCellColor = (count: number): string => {
    if (count === 0) {
      return theme.palette.divider
    }
    if (count === 1) {
      return alpha(theme.palette.primary.main, 0.3)
    }
    if (count === 2) {
      return alpha(theme.palette.primary.main, 0.6)
    }
    return theme.palette.primary.main
  }

  const formatDateString = (date: Date): string => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const getTooltipText = (dateStr: string, count: number): string => {
    return `${count} tasks completed on ${dateStr}`
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${weeks}, 16px)`,
        gridTemplateRows: 'repeat(7, 16px)',
        gridAutoFlow: 'column',
        gap: 0.5,
        width: 'fit-content',
        p: 0.5,
      }}
    >
      {gridDays.map((day, index) => {
        const dateStr = formatDateString(day)
        const count = dataMap.get(dateStr) || 0
        const cellColor = getCellColor(count)
        const tooltipText = getTooltipText(dateStr, count)
        const isSelected = dateStr === activeDate
        const isOverdue = overdueDates?.includes(dateStr)

        return (
          <Tooltip
            key={dateStr || index}
            title={tooltipText}
            arrow
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: 'preventOverflow',
                    options: {
                      boundary: 'window',
                    },
                  },
                ],
              },
            }}
          >
            <Box
              onClick={() => onCellClick?.(dateStr)}
              role="button"
              aria-label={tooltipText}
              sx={{
                width: 16,
                height: 16,
                borderRadius: 0.5,
                backgroundColor: cellColor,
                cursor: onCellClick ? 'pointer' : 'default',
                border: isSelected ? '2px solid' : 'none',
                borderColor: 'text.primary',
                boxSizing: 'border-box',
                position: 'relative',
                transition: 'all 0.2s',
                '&:hover': {
                  opacity: 0.8,
                  transform: 'scale(1.2)',
                  zIndex: 2,
                },
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
