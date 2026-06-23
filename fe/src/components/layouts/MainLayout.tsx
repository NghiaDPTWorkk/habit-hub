import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Box, IconButton, BottomNavigation, BottomNavigationAction } from '@/components/ui'
import { useBoundStore } from '@/store'
import { pxToRem } from '@/utils'

// Sub-layouts
import { Sidebar } from './Sidebar'
import { PageHeader } from './PageHeader'
import { AtRiskBanner } from './AtRiskBanner'

// Icons
import { Icons } from '@/components/ui/icons'
import GridViewIcon from '@mui/icons-material/GridView'
import EditIcon from '@mui/icons-material/Edit'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import TrackChangesIcon from '@mui/icons-material/TrackChanges'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const BRAND_FIRST = 'Trace'
const BRAND_SECOND = 'X'
const MOCK_SUBTITLE_DASHBOARD = 'System overview dashboard.'
const MOCK_SUBTITLE_HABITS = 'Build and manage all the habits you want to track.'
const MOCK_SUBTITLE_GOALS = 'Define targets and track progress achievements'
const MOCK_SUBTITLE_CHECKINS = 'Track your progress and check-in history.'
const MOCK_SUBTITLE_SETTINGS = 'Export data records and administrative tools'

const MOCK_TITLE_DASHBOARD = 'Overview'
const MOCK_TITLE_HABITS = 'Habits'
const MOCK_TITLE_GOALS = 'Goals & Milestones'
const MOCK_TITLE_CHECKINS = 'Progress'
const MOCK_TITLE_SETTINGS = 'Settings & Backups'

export const MainLayout: React.FC = () => {
  const currentYear = new Date().getFullYear()
  const location = useLocation()
  const navigate = useNavigate()
  const themeMode = useBoundStore((state) => state.themeMode) || 'light'
  const toggleThemeMode = useBoundStore((state) => state.toggleThemeMode)
  const getBottomNavValue = () => {
    if (location.pathname.startsWith('/habits')) return 1
    if (location.pathname.startsWith('/checkins')) return 2
    if (location.pathname.startsWith('/goals')) return 3
    if (location.pathname === '/settings') return -1
    return 0
  }

  const handleBottomNavChange = (_: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/dashboard')
        break
      case 1:
        navigate('/habits')
        break
      case 2:
        navigate('/checkins')
        break
      case 3:
        navigate('/goals')
        break
      default:
        break
    }
  }

  const getPageHeaderInfo = (pathname: string) => {
    if (pathname.startsWith('/habits')) {
      return {
        title: MOCK_TITLE_HABITS,
        subtitle: MOCK_SUBTITLE_HABITS,
      }
    }
    if (pathname.startsWith('/goals')) {
      return {
        title: MOCK_TITLE_GOALS,
        subtitle: MOCK_SUBTITLE_GOALS,
      }
    }
    if (pathname.startsWith('/checkins')) {
      return {
        title: MOCK_TITLE_CHECKINS,
        subtitle: MOCK_SUBTITLE_CHECKINS,
      }
    }
    if (pathname.startsWith('/settings')) {
      return {
        title: MOCK_TITLE_SETTINGS,
        subtitle: MOCK_SUBTITLE_SETTINGS,
      }
    }
    return {
      title: MOCK_TITLE_DASHBOARD,
      subtitle: MOCK_SUBTITLE_DASHBOARD,
    }
  }

  const { title, subtitle } = getPageHeaderInfo(location.pathname)

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      {/* Sidebar for Desktop */}
      <Box
        component="nav"
        sx={{
          width: pxToRem(260),
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          borderRight: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Sidebar pathname={location.pathname} currentYear={currentYear} />
      </Box>

      {/* Main Content Pane */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflowY: 'auto',
          minWidth: 0,
        }}
      >
        {/* Mobile Header Bar */}
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          {location.pathname === '/settings' ? (
            <IconButton color="inherit" edge="start" onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
          ) : (
            <Box sx={{ width: 40 }} />
          )}
          <Box
            onClick={() => navigate('/dashboard')}
            sx={{
              fontWeight: 700,
              fontSize: pxToRem(22),
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              userSelect: 'none',
              '&:hover': {
                opacity: 0.85,
              },
            }}
          >
            {BRAND_FIRST}
            <Box component="span" style={{ color: '#238636' }} sx={{ fontWeight: 900 }}>
              {BRAND_SECOND}
            </Box>
          </Box>
          <IconButton
            onClick={toggleThemeMode}
            sx={{
              color: themeMode === 'dark' ? 'warning.main' : 'inherit',
            }}
          >
            {themeMode === 'light' ? <Icons.DarkMode /> : <Icons.LightMode />}
          </IconButton>
        </Box>

        {/* Global Page Header */}
        <PageHeader
          title={title}
          subtitle={subtitle}
          themeMode={themeMode}
          toggleThemeMode={toggleThemeMode}
        />

        {/* Page Body Wrapper */}
        <Box
          sx={{
            flexGrow: 1,
            px: { xs: 2, md: 4 },
            pt: 2,
            pb: { xs: 10, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 'lg' }}>
            <AtRiskBanner />
            <Outlet />
          </Box>
        </Box>
      </Box>

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation
        value={getBottomNavValue()}
        onChange={handleBottomNavChange}
        showLabels
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          height: 56,
        }}
      >
        <BottomNavigationAction label="Overview" icon={<GridViewIcon />} />
        <BottomNavigationAction label="Habits" icon={<EditIcon />} />
        <BottomNavigationAction label="Progress" icon={<CalendarMonthIcon />} />
        <BottomNavigationAction label="Goals" icon={<TrackChangesIcon />} />
      </BottomNavigation>
    </Box>
  )
}
export default MainLayout
