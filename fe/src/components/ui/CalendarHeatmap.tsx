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
}

export const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({ data, weeks = 12 }) => {
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
    const startOffset = weeks * 7 - 1 + currentDayOfWeek
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
    return date.toISOString().split('T')[0]
  }

  const getTooltipText = (dateStr: string, count: number): string => {
    return `${count} check-ins on ${dateStr}`
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${weeks}, 1fr)`,
        gridTemplateRows: 'repeat(7, auto)',
        gridAutoFlow: 'column',
        gap: 0.5,
        width: '100%',
      }}
    >
      {gridDays.map((day, index) => {
        const dateStr = formatDateString(day)
        const count = dataMap.get(dateStr) || 0
        const cellColor = getCellColor(count)
        const tooltipText = getTooltipText(dateStr, count)

        return (
          <Tooltip key={dateStr || index} title={tooltipText} arrow>
            <Box
              sx={{
                aspectRatio: '1',
                borderRadius: 0.5,
                backgroundColor: cellColor,
                transition: 'background-color 0.2s',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            />
          </Tooltip>
        )
      })}
    </Box>
  )
}

export default CalendarHeatmap
