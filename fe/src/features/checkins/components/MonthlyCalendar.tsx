import React, { useState, useMemo } from 'react'
import dayjs, { type Dayjs } from 'dayjs'
import { Box, Typography, IconButton, alpha } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { pxToRem } from '@/utils'
import { getDayStatus } from '../utils'
import type { Habit, Checkin } from '@/types'

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
const DATE_FORMAT_MONTH_YEAR = 'MMMM YYYY'
const VARIANT_BODY2 = 'body2'
const VARIANT_SUBTITLE1 = 'subtitle1'
const COLOR_TEXT_SECONDARY = 'text.secondary'
const COLOR_TEXT_DISABLED = 'text.disabled'
const COLOR_TEXT_PRIMARY = 'text.primary'
const COLOR_SUCCESS_MAIN = 'success.main'
const SIZE_SMALL = 'small'
const DISPLAY_GRID = 'grid'
const GRID_COLS_7 = 'repeat(7, 1fr)'
const ALIGN_CENTER = 'center'
const BG_TRANSPARENT = 'transparent'
const DOUBLE_ZERO_SIX = 0.06
const DOUBLE_ZERO_FOUR = 0.04

export interface MonthlyCalendarProps {
  selectedDate: Dayjs
  onSelectDate: (date: Dayjs) => void
  habits: Habit[]
  getCheckinByHabitAndDate: (habitId: number, date: string) => Checkin | null | undefined
}

export const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  selectedDate,
  onSelectDate,
  habits,
  getCheckinByHabitAndDate,
}) => {
  const [prevSelectedDate, setPrevSelectedDate] = useState<Dayjs>(selectedDate)
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(selectedDate)

  if (!selectedDate.isSame(prevSelectedDate, 'day')) {
    setPrevSelectedDate(selectedDate)
    if (!selectedDate.isSame(currentMonth, 'month')) {
      setCurrentMonth(selectedDate)
    }
  }

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => prev.subtract(1, 'month'))
  }

  const handleNextMonth = () => {
    setCurrentMonth((prev) => prev.add(1, 'month'))
  }

  const handleDateClick = (day: Dayjs) => {
    if (day.isAfter(dayjs(), 'day')) return
    onSelectDate(day)
    if (day.month() !== currentMonth.month()) {
      setCurrentMonth(day)
    }
  }

  const calendarDays = useMemo(() => {
    const startOfMonth = currentMonth.startOf('month')
    const offset = (startOfMonth.day() + 6) % 7
    const calendarStart = startOfMonth.subtract(offset, 'day')

    return Array.from({ length: 42 }, (_, i) => calendarStart.add(i, 'day'))
  }, [currentMonth])

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant={VARIANT_SUBTITLE1} sx={{ fontWeight: 700 }}>
          {currentMonth.format(DATE_FORMAT_MONTH_YEAR)}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size={SIZE_SMALL} onClick={handlePrevMonth}>
            <Icons.ChevronLeft fontSize={SIZE_SMALL} />
          </IconButton>
          <IconButton size={SIZE_SMALL} onClick={handleNextMonth}>
            <Icons.ChevronRight fontSize={SIZE_SMALL} />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          display: DISPLAY_GRID,
          gridTemplateColumns: GRID_COLS_7,
          gap: { xs: 0.5, sm: 1 },
          mb: { xs: 1, sm: 1.5 },
        }}
      >
        {WEEKDAYS.map((label, idx) => (
          <Typography
            key={idx}
            variant={VARIANT_BODY2}
            align={ALIGN_CENTER}
            sx={{
              fontWeight: 700,
              color: COLOR_TEXT_SECONDARY,
              fontSize: { xs: pxToRem(10), sm: pxToRem(12) },
              letterSpacing: { xs: 0, sm: 0.5 },
            }}
          >
            {label}
          </Typography>
        ))}
      </Box>

      <Box
        sx={{ display: DISPLAY_GRID, gridTemplateColumns: GRID_COLS_7, gap: { xs: 0.5, sm: 1 } }}
      >
        {calendarDays.map((day) => {
          const isCurrentMonth = day.month() === currentMonth.month()
          const isFuture = day.isAfter(dayjs(), 'day')
          const isSelected = !isFuture && day.isSame(selectedDate, 'day')
          const isToday = day.isSame(dayjs(), 'day')
          const status = getDayStatus(day, habits, getCheckinByHabitAndDate)
          const dateStr = day.format('YYYY-MM-DD')

          return (
            <Box
              key={dateStr}
              onClick={() => handleDateClick(day)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: ALIGN_CENTER,
                justifyContent: ALIGN_CENTER,
                pt: { xs: 1, sm: 1.25 },
                pb: { xs: 0.75, sm: 1 },
                px: { xs: 0.25, sm: 1 },
                borderRadius: 2,
                border: '1px solid',
                borderColor: isSelected ? COLOR_SUCCESS_MAIN : BG_TRANSPARENT,
                backgroundColor: isSelected
                  ? (theme) => alpha(theme.palette.success.main, DOUBLE_ZERO_SIX)
                  : isToday
                    ? (theme) => alpha(theme.palette.action.hover, DOUBLE_ZERO_FOUR)
                    : BG_TRANSPARENT,
                cursor: isFuture ? 'default' : 'pointer',
                opacity: isFuture ? 0.35 : isCurrentMonth ? 1 : 0.45,
                userSelect: 'none',
                position: 'relative',
                transition: 'all 0.2s',
                '&:hover': isFuture
                  ? {}
                  : {
                      borderColor: isSelected ? COLOR_SUCCESS_MAIN : 'divider',
                      backgroundColor: isSelected
                        ? (theme) => alpha(theme.palette.success.main, DOUBLE_ZERO_SIX)
                        : 'action.hover',
                    },
              }}
            >
              <Typography
                variant={VARIANT_BODY2}
                sx={{
                  fontWeight: isSelected || isToday ? 700 : 600,
                  color: isSelected
                    ? COLOR_SUCCESS_MAIN
                    : isToday
                      ? COLOR_TEXT_PRIMARY
                      : isCurrentMonth
                        ? COLOR_TEXT_PRIMARY
                        : COLOR_TEXT_DISABLED,
                  fontSize: { xs: pxToRem(12), sm: pxToRem(14) },
                  mb: 0.25,
                }}
              >
                {day.date()}
              </Typography>
              <Box
                sx={{
                  width: { xs: 5, sm: 6 },
                  height: { xs: 5, sm: 6 },
                  borderRadius: '50%',
                  backgroundColor:
                    status === 'completed'
                      ? COLOR_SUCCESS_MAIN
                      : status === 'overdue'
                        ? 'error.main'
                        : BG_TRANSPARENT,
                }}
              />
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
