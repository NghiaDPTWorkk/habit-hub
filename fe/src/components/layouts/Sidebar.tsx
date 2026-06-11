import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { alpha } from '@mui/material/styles'
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
const USER_NAME = 'Trần Nghĩa'
const USER_PLAN = 'Premium Plan'
const NAV_OVERVIEW = 'Overview'
const NAV_HABITS = 'Habits'
const NAV_PROGRESS = 'Progress'
const NAV_GOALS = 'Goals'
const FOOTER_TEXT = 'Habit Hub © '

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
          gap: 1,
          px: 3,
          py: 3,
        }}
      >
        <Box
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 38,
            width: 38,
            borderRadius: 1,
            bgcolor: theme.palette.grey[900],
            border: '1px solid',
            borderColor: alpha(theme.palette.primary.main, 0.35),
            p: 0.5,
          })}
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
            fontSize: pxToRem(20),
            letterSpacing: pxToRem(-0.48),
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {BRAND_FIRST}
          <Box
            component="span"
            style={{ color: '#10B981' }}
            sx={{
              fontWeight: 900,
            }}
          >
            {BRAND_SECOND}
          </Box>
        </Typography>
      </Box>

      {/* User Profile Card */}
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          p: 1.5,
          mx: 2.5,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          bgcolor: 'background.paper',
        }}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            fontWeight: 'bold',
            fontSize: pxToRem(14),
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
          px: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
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
              py: 1,
              borderRadius: 2,
              fontWeight: item.active ? 600 : 500,
              color: item.active ? 'primary.main' : 'text.secondary',
              bgcolor: item.active ? 'primary.light' : 'transparent',
              '&:hover': {
                bgcolor: item.active
                  ? 'primary.light'
                  : (theme) => alpha(theme.palette.primary.main, 0.05),
                color: 'primary.main',
              },
              '& .MuiButton-startIcon': {
                color: item.active ? 'primary.main' : 'text.secondary',
                mr: 1.5,
              },
            }}
          >
            {item.label}
          </Button>
        ))}
      </Box>

      {/* Footer Inside Sidebar */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          mt: 'auto',
        }}
      >
        <Typography
          variant="caption"
          align="center"
          sx={{ color: 'text.secondary', display: 'block' }}
        >
          {FOOTER_TEXT}
          {currentYear}
        </Typography>
      </Box>
    </Box>
  )
}
