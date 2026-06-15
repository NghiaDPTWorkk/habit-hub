import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Typography, Button } from '@/components/ui'
import { pxToRem } from '@/utils'

// MUI Icons
import GridViewIcon from '@mui/icons-material/GridView'
import EditIcon from '@mui/icons-material/Edit'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import TrackChangesIcon from '@mui/icons-material/TrackChanges'

import logo3Img from '@/assets/logo3.png'

interface SidebarProps {
  pathname: string
  onCloseMobile?: () => void
  currentYear: number
}

const BRAND_FIRST = 'Trace'
const BRAND_SECOND = 'X'

const NAV_OVERVIEW = 'Overview'
const NAV_HABITS = 'Habits'
const NAV_PROGRESS = 'Progress'
const NAV_GOALS = 'Goals'
const FOOTER_TEXT = 'ByteBuilders © '

export const Sidebar: React.FC<SidebarProps> = ({ pathname, onCloseMobile, currentYear }) => {
  const isDashboardActive = pathname === '/dashboard' || pathname === '/'
  const isHabitsActive = pathname.startsWith('/habits')
  const isGoalsActive = pathname.startsWith('/goals')
  const isCheckinsActive = pathname.startsWith('/checkins')

  const navItems = [
    {
      label: NAV_OVERVIEW,
      path: '/dashboard',
      icon: <GridViewIcon fontSize="small" />,
      active: isDashboardActive,
    },
    {
      label: NAV_HABITS,
      path: '/habits',
      icon: <EditIcon fontSize="small" />,
      active: isHabitsActive,
    },
    {
      label: NAV_PROGRESS,
      path: '/checkins',
      icon: <CalendarMonthIcon fontSize="small" />,
      active: isCheckinsActive,
    },
    {
      label: NAV_GOALS,
      path: '/goals',
      icon: <TrackChangesIcon fontSize="small" />,
      active: isGoalsActive,
    },
  ]

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'background.paper',
      }}
    >
      {/* Branding Section */}
      <Box
        component={RouterLink}
        to="/dashboard"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 3,
          py: 3,
          textDecoration: 'none',
          color: 'inherit',
          cursor: 'pointer',
          '&:hover': {
            opacity: 0.85,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 32,
            width: 32,
            borderRadius: 1,
            bgcolor: 'grey.900',
            p: 0.5,
          }}
        >
          <Box
            component="img"
            src={logo3Img}
            alt="Logo"
            sx={{ height: '100%', width: '100%', objectFit: 'contain' }}
          />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: pxToRem(24),
            letterSpacing: pxToRem(-0.48),
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {BRAND_FIRST}
          <Box
            component="span"
            sx={{
              fontWeight: 900,
              color: 'primary.main',
            }}
          >
            {BRAND_SECOND}
          </Box>
        </Typography>
      </Box>

      {/* Navigation Links */}
      <Box
        sx={{
          flexGrow: 1,
          px: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {navItems.map((item) => (
          <Button
            key={item.label}
            component={RouterLink}
            to={item.path}
            onClick={onCloseMobile}
            variant="text"
            startIcon={item.icon}
            sx={{
              justifyContent: 'flex-start',
              px: 2,
              py: 1.25,
              borderRadius: 1,
              fontWeight: 500,
              fontSize: pxToRem(14.5),
              color: item.active ? 'primary.main' : 'text.secondary',
              bgcolor: item.active ? 'primary.light' : 'transparent',
              '&:hover': {
                bgcolor: item.active ? 'primary.light' : 'action.hover',
                color: item.active ? 'primary.main' : 'text.primary',
                '& .MuiButton-startIcon': {
                  color: item.active ? 'primary.main' : 'text.primary',
                },
              },
              '& .MuiButton-startIcon': {
                color: item.active ? 'primary.main' : 'text.secondary',
                mr: 1.5,
                transition: 'color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              },
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {item.label}
          </Button>
        ))}
      </Box>

      {/* Footer Inside Sidebar */}
      <Box
        sx={{
          p: 2.5,
          mt: 'auto',
        }}
      >
        <Typography
          variant="caption"
          align="center"
          sx={{
            color: 'text.secondary',
            display: 'block',
            opacity: 0.7,
            fontSize: pxToRem(12),
          }}
        >
          {FOOTER_TEXT}
          {currentYear}
        </Typography>
      </Box>
    </Box>
  )
}

export default Sidebar
