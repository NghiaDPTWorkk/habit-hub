import React from 'react'
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom'
import { alpha } from '@mui/material/styles'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Avatar,
} from '@/components/ui'
import { APP_CONSTANTS } from '@/constants'
import { useBoundStore } from '@/store'
import { Icons } from '@/components/ui/icons'
import logo3Img from '@/assets/logo3.png'

const USER_INITIAL = 'U'
const BRAND_FIRST_PART = 'Trace'
const BRAND_SECOND_PART = 'X'
const BRAND_FONT_SIZE = '1.35rem'
const BRAND_LETTER_SPACING = '-0.03em'
const BRAND_X_COLOR = '#10B981'

export const MainLayout: React.FC = () => {
  const currentYear = new Date().getFullYear()
  const location = useLocation()
  const themeMode = useBoundStore((state) => state.themeMode) || 'light'
  const toggleThemeMode = useBoundStore((state) => state.toggleThemeMode)

  const isDashboardActive = location.pathname === '/dashboard' || location.pathname === '/'
  const isHabitsActive = location.pathname.startsWith('/habits')
  const isGoalsActive = location.pathname.startsWith('/goals')
  const isCheckinsActive = location.pathname.startsWith('/checkins')

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <Box
            component={RouterLink}
            to="/dashboard"
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: 1,
              gap: 0.75,
              textDecoration: 'none',
            }}
          >
            <Box
              sx={(theme) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 36,
                width: 36,
                borderRadius: 1.25,
                bgcolor: theme.palette.grey[900],
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.35),
                boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.15)}`,
                p: 0.75,
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
                fontSize: BRAND_FONT_SIZE,
                letterSpacing: BRAND_LETTER_SPACING,
                color: 'text.primary',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {BRAND_FIRST_PART}
              <Box
                component="span"
                sx={{
                  color: BRAND_X_COLOR,
                  fontWeight: 900,
                }}
              >
                {BRAND_SECOND_PART}
              </Box>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              component={RouterLink}
              to="/dashboard"
              sx={{
                color: isDashboardActive ? 'primary.main' : 'text.secondary',
                fontWeight: isDashboardActive ? 700 : 500,
                '&:hover': { color: 'primary.main' },
              }}
            >
              {APP_CONSTANTS.NAVIGATION.DASHBOARD}
            </Button>
            <Button
              component={RouterLink}
              to="/habits"
              sx={{
                color: isHabitsActive ? 'primary.main' : 'text.secondary',
                fontWeight: isHabitsActive ? 700 : 500,
                '&:hover': { color: 'primary.main' },
              }}
            >
              {APP_CONSTANTS.NAVIGATION.HABITS}
            </Button>
            <Button
              component={RouterLink}
              to="/goals"
              sx={{
                color: isGoalsActive ? 'primary.main' : 'text.secondary',
                fontWeight: isGoalsActive ? 700 : 500,
                '&:hover': { color: 'primary.main' },
              }}
            >
              {APP_CONSTANTS.NAVIGATION.GOALS}
            </Button>
            <Button
              component={RouterLink}
              to="/checkins"
              sx={{
                color: isCheckinsActive ? 'primary.main' : 'text.secondary',
                fontWeight: isCheckinsActive ? 700 : 500,
                '&:hover': { color: 'primary.main' },
              }}
            >
              {APP_CONSTANTS.NAVIGATION.CHECKINS}
            </Button>
            <IconButton color="inherit" onClick={toggleThemeMode} sx={{ ml: 1 }}>
              {themeMode === 'light' ? <Icons.DarkMode /> : <Icons.LightMode />}
            </IconButton>
            <IconButton color="inherit" sx={{ ml: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  fontWeight: 'bold',
                }}
              >
                {USER_INITIAL}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet />
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="body2"
            align="center"
            sx={{
              color: 'text.secondary',
            }}
          >
            {APP_CONSTANTS.FOOTER.COPY}
            {currentYear}
            {APP_CONSTANTS.FOOTER.TEXT}
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}
export default MainLayout
