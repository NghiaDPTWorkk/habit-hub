import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Button, IconButton } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { useDashboard } from '@/features/dashboard/hooks'
import { useBoundStore } from '@/store'
import { pxToRem } from '@/utils'

const BANNER_TITLE_SINGLE = 'Habit at risk today'
const BANNER_TITLE_PLURAL = 'Habits at risk today'
const BTN_GO_TO_CHECKIN = 'Go to Check-in →'
const CHECKINS_ROUTE = '/checkins'
const BTN_SHADOW = '0 4px 12px rgba(242, 153, 74, 0.15)'
const BTN_HOVER_SHADOW = '0 6px 16px rgba(242, 153, 74, 0.25)'
const CLOSE_BTN_HOVER_BG = 'rgba(242, 153, 74, 0.08)'

export const AtRiskBanner: React.FC = () => {
  const navigate = useNavigate()
  const { summary } = useDashboard()
  const habits = useBoundStore((state) => state.habits)
  const [dismissedKey, setDismissedKey] = React.useState<string | null>(null)

  const atRiskList = React.useMemo(() => {
    return habits.filter((h) => summary.atRiskHabitIds?.includes(h.id))
  }, [habits, summary.atRiskHabitIds])

  const currentKey = React.useMemo(() => {
    if (atRiskList.length === 0) return null
    // Key combines today's date and the list of at-risk habit IDs
    const todayStr = new Date().toLocaleDateString('en-CA')
    const ids = atRiskList.map((h) => h.id).join('_')
    return `${todayStr}_${ids}`
  }, [atRiskList])

  if (atRiskList.length === 0 || (currentKey && dismissedKey === currentKey)) {
    return null
  }

  const title = atRiskList.length === 1 ? BANNER_TITLE_SINGLE : BANNER_TITLE_PLURAL
  const habitNamesText = atRiskList.map((h) => h.name).join(', ')

  const handleGoToCheckin = () => {
    const todayStr = new Date().toLocaleDateString('en-CA')
    navigate(`${CHECKINS_ROUTE}?date=${todayStr}`)
  }

  const handleDismiss = () => {
    if (currentKey) {
      setDismissedKey(currentKey)
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
            {title}
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              fontSize: pxToRem(14.5),
            }}
          >
            {habitNamesText}
          </Typography>
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

export default AtRiskBanner
