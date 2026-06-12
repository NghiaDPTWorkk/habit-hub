import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Button, IconButton } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { useBoundStore } from '@/store'
import { isScheduledForDate } from '@/features/habits/services/ScheduleService'
import { pxToRem } from '@/utils'

const BANNER_TITLE = 'Habits need your attention'
const BTN_GO_TO_CHECKIN = 'Go to Check-in →'
const CHECKINS_ROUTE = '/checkins'
const STATUS_ACTIVE = 'Active'
const BTN_SHADOW = '0 4px 12px rgba(242, 153, 74, 0.15)'
const BTN_HOVER_SHADOW = '0 6px 16px rgba(242, 153, 74, 0.25)'
const CLOSE_BTN_HOVER_BG = 'rgba(242, 153, 74, 0.08)'

export const AttentionBanner: React.FC = () => {
  const navigate = useNavigate()
  const habits = useBoundStore((state) => state.habits)
  const checkins = useBoundStore((state) => state.checkins)
  const [dismissedHabitKey, setDismissedHabitKey] = React.useState<string | null>(null)

  const neglectedHabitInfo = (() => {
    const today = new Date()
    for (let d = 1; d <= 7; d++) {
      const checkDate = new Date()
      checkDate.setDate(today.getDate() - d)
      const offset = checkDate.getTimezoneOffset()
      const localDate = new Date(checkDate.getTime() - offset * 60 * 1000)
      const checkDateStr = localDate.toISOString().split('T')[0]

      for (const h of habits) {
        if (h.status !== STATUS_ACTIVE) continue
        if (isScheduledForDate(h, checkDateStr)) {
          const key = `${checkDateStr}_${h.id}`
          const checkin = checkins[key]
          const isCompleted = checkin && checkin.completedCount >= h.targetPerDay
          if (!isCompleted) {
            return {
              habit: h,
              daysAgo: d,
              dateStr: checkDateStr,
            }
          }
        }
      }
    }
    return null
  })()

  const currentKey = neglectedHabitInfo
    ? `${neglectedHabitInfo.dateStr}_${neglectedHabitInfo.habit.id}`
    : null

  if (!neglectedHabitInfo || (currentKey && dismissedHabitKey === currentKey)) return null

  const daysAgoText = ` ${neglectedHabitInfo.daysAgo} days ago`

  const handleGoToCheckin = () => {
    navigate(`${CHECKINS_ROUTE}?date=${neglectedHabitInfo.dateStr}`)
  }

  const handleDismiss = () => {
    if (currentKey) {
      setDismissedHabitKey(currentKey)
    }
  }

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        py: 2.25,
        px: 4,
        pr: { xs: 4, sm: 6 }, // Extra right padding for close button
        mb: 3,
        bgcolor: 'warning.light',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'warning.border',
        gap: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
        <Icons.WarningAmber
          sx={{
            color: 'warning.main',
            fontSize: pxToRem(26),
          }}
        />
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              color: 'warning.main',
              fontSize: pxToRem(16),
              lineHeight: 1.3,
              mb: 0.5,
            }}
          >
            {BANNER_TITLE}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
            <Typography
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: pxToRem(14.5),
                textDecoration: 'underline',
                textDecorationColor: 'text.primary',
                textUnderlineOffset: 3,
              }}
            >
              {neglectedHabitInfo.habit.name}
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: pxToRem(14.5),
              }}
            >
              {daysAgoText}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Button
        variant="contained"
        onClick={handleGoToCheckin}
        sx={{
          bgcolor: 'warning.main',
          color: 'warning.contrastText',
          fontWeight: 700,
          borderRadius: 1.5,
          px: 3.5,
          py: 1,
          boxShadow: BTN_SHADOW,
          textTransform: 'none',
          fontSize: pxToRem(14),
          '&:hover': {
            bgcolor: 'warning.dark',
            boxShadow: BTN_HOVER_SHADOW,
          },
          alignSelf: { xs: 'stretch', sm: 'auto' },
        }}
      >
        {BTN_GO_TO_CHECKIN}
      </Button>

      {/* Dismiss Button */}
      <IconButton
        onClick={handleDismiss}
        size="small"
        sx={{
          position: 'absolute',
          top: pxToRem(10),
          right: pxToRem(10),
          color: 'warning.main',
          '&:hover': {
            bgcolor: CLOSE_BTN_HOVER_BG,
          },
        }}
      >
        <Icons.Close sx={{ fontSize: pxToRem(18) }} />
      </IconButton>
    </Box>
  )
}

export default AttentionBanner
