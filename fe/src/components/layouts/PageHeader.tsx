import React from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { pxToRem } from '@/utils'
import { Box, Typography, Button, IconButton } from '@/components/ui'
import { Icons } from '@/components/ui/icons'

interface PageHeaderProps {
  title: string
  subtitle: string
  themeMode: 'light' | 'dark'
  toggleThemeMode: () => void
}

const BTN_CREATE_HABIT = 'Create Habit'

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  themeMode,
  toggleThemeMode,
}) => {
  const location = useLocation()
  const isSettingsActive = location.pathname === '/settings'
  return (
    <Box
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          px: { xs: 2, md: 4 },
          py: 2,
          maxWidth: 'lg',
          mx: 'auto',
          width: '100%',
        }}
      >
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {subtitle}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 1.25,
            alignItems: 'center',
            flexWrap: 'wrap',
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          <IconButton
            onClick={toggleThemeMode}
            aria-label="Toggle theme"
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 0.75,
              display: { xs: 'none', md: 'inline-flex' },
              color: themeMode === 'dark' ? 'warning.main' : 'text.primary',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            {themeMode === 'light' ? (
              <Icons.DarkModeOutlined fontSize="small" />
            ) : (
              <Icons.LightModeOutlined fontSize="small" />
            )}
          </IconButton>
          <IconButton
            component={RouterLink}
            to="/settings"
            aria-label="Settings"
            sx={{
              border: '1px solid',
              borderColor: isSettingsActive ? 'primary.main' : 'divider',
              borderRadius: 1,
              p: 0.75,
              color: isSettingsActive ? 'primary.main' : 'text.primary',
              bgcolor: isSettingsActive ? 'primary.light' : 'transparent',
              '&:hover': {
                bgcolor: isSettingsActive ? 'primary.light' : 'action.hover',
              },
            }}
          >
            {isSettingsActive ? (
              <Icons.Settings fontSize="small" />
            ) : (
              <Icons.SettingsOutlined fontSize="small" />
            )}
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Icons.Add />}
            component={RouterLink}
            to="/habits"
            sx={{
              borderRadius: 1,
              px: 3,
              py: 1.25,
              fontWeight: 600,
              fontSize: pxToRem(15),
            }}
          >
            {BTN_CREATE_HABIT}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
