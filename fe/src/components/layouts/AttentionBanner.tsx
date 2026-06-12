import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Button } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { useBoundStore } from '@/store'
import { isScheduledForDate } from '@/features/habits/services/ScheduleService'
import { pxToRem } from '@/utils'

const BANNER_TITLE = 'Habits need your attention'
const BTN_GO_TO_CHECKIN = 'Go to Check-in →'
const CHECKINS_ROUTE = '/checkins'
const STATUS_ACTIVE = 'Active'

export const AttentionBanner: React.FC = () => {
  const navigate = useNavigate()
  const habits = useBoundStore((state) => state.habits)
  const checkins = useBoundStore((state) => state.checkins)

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

  if (!neglectedHabitInfo) return null

  const daysAgoText = ` ${neglectedHabitInfo.daysAgo} days ago`

  const handleGoToCheckin = () => {
    navigate(CHECKINS_ROUTE, { state: { date: neglectedHabitInfo.dateStr } })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        p: 2,
        mb: 3,
        bgcolor: 'warning.light',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'warning.light',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <Icons.WarningAmber
          sx={{
            color: 'warning.main',
            fontSize: pxToRem(24),
            mt: 0.25,
          }}
        />
        <Box>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 700,
              color: 'warning.dark',
              lineHeight: 1.2,
              mb: 0.5,
            }}
          >
            {BANNER_TITLE}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                textDecoration: 'underline',
              }}
            >
              {neglectedHabitInfo.habit.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
              }}
            >
              {daysAgoText}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Button
        variant="contained"
        color="warning"
        onClick={handleGoToCheckin}
        sx={{
          bgcolor: 'warning.main',
          color: 'warning.contrastText',
          fontWeight: 700,
          borderRadius: 2,
          px: 3,
          py: 1,
          '&:hover': {
            bgcolor: 'warning.dark',
          },
          alignSelf: { xs: 'stretch', sm: 'auto' },
        }}
      >
        {BTN_GO_TO_CHECKIN}
      </Button>
    </Box>
  )
}

export default AttentionBanner
