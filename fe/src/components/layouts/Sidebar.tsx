import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Typography, Avatar, Button } from '@/components/ui'
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

const USER_INITIALS = 'TN'
const USER_NAME = 'Dương Nghĩa'
const USER_PLAN = 'Premium Plan'
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
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 3,
          py: 3,
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

      {/* User Profile Card */}
      <Box
        sx={{
          borderRadius: 2,
          px: 2,
          py: 1.5,
          mx: 3,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            fontWeight: 'bold',
            fontSize: pxToRem(15),
          }}
        >
          {USER_INITIALS}
        </Avatar>
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {USER_NAME}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              display: 'block',
              mt: 0.25,
            }}
          >
            {USER_PLAN}
          </Typography>
        </Box>
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
