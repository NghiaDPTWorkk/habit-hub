import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { pxToRem } from '@/utils'
import { Box, Typography, Button, IconButton } from '@/components/ui'

// MUI Icons
import SettingsIcon from '@mui/icons-material/Settings'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'

import AddIcon from '@mui/icons-material/Add'

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
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        px: { xs: 2, md: 4 },
        py: 3,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
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
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1.5,
            p: 0.75,
            display: { xs: 'none', md: 'inline-flex' },
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          {themeMode === 'light' ? (
            <DarkModeIcon fontSize="small" />
          ) : (
            <LightModeIcon fontSize="small" />
          )}
        </IconButton>
        <IconButton
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1.5,
            p: 0.75,
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <SettingsIcon fontSize="small" />
        </IconButton>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/habits"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.25,
            fontWeight: 600,
            fontSize: pxToRem(15),
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          {BTN_CREATE_HABIT}
        </Button>
      </Box>
    </Box>
  )
}
