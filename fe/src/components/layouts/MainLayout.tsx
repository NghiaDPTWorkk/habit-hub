import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Box, IconButton, Drawer } from '@/components/ui'
import { useBoundStore } from '@/store'
import { pxToRem } from '@/utils'

// Sub-layouts
import { Sidebar } from './Sidebar'
import { PageHeader } from './PageHeader'

// MUI Icons
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import InfoIcon from '@mui/icons-material/Info'
import MenuIcon from '@mui/icons-material/Menu'

const BRAND_FIRST = 'Trace'
const BRAND_SECOND = 'X'
const MOCK_SUBTITLE_DASHBOARD = 'System overview dashboard.'
const MOCK_SUBTITLE_HABITS = 'Build and manage all the habits you want to track.'
const MOCK_SUBTITLE_GOALS = 'Define targets and track progress achievements'
const MOCK_SUBTITLE_CHECKINS = 'Track your progress and check-in history.'

const MOCK_TITLE_DASHBOARD = 'Overview'
const MOCK_TITLE_HABITS = 'Habits'
const MOCK_TITLE_GOALS = 'Goals & Milestones'
const MOCK_TITLE_CHECKINS = 'Progress'

export const MainLayout: React.FC = () => {
  const currentYear = new Date().getFullYear()
  const location = useLocation()
  const themeMode = useBoundStore((state) => state.themeMode) || 'light'
  const toggleThemeMode = useBoundStore((state) => state.toggleThemeMode)

  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
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

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: pxToRem(260),
          },
        }}
      >
        <Sidebar
          pathname={location.pathname}
          onCloseMobile={handleDrawerToggle}
          currentYear={currentYear}
        />
      </Drawer>

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
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              fontWeight: 700,
              fontSize: pxToRem(22),
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {BRAND_FIRST}
            <Box component="span" style={{ color: '#238636' }} sx={{ fontWeight: 900 }}>
              {BRAND_SECOND}
            </Box>
          </Box>
          <IconButton color="inherit" onClick={toggleThemeMode}>
            {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
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
            pb: { xs: 2, md: 4 },
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* Floating Help Button */}
      <IconButton
        sx={(theme) => ({
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 48,
          height: 48,
          bgcolor: 'info.main',
          color: 'info.contrastText',
          boxShadow: theme.shadows[3],
          '&:hover': {
            bgcolor: 'info.dark',
          },
          zIndex: 1000,
        })}
      >
        <InfoIcon />
      </IconButton>
    </Box>
  )
}
export default MainLayout
