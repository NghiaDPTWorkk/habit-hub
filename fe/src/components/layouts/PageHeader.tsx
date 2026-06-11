import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
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
            borderRadius: 2,
            p: 1,
            display: { xs: 'none', md: 'inline-flex' },
          }}
        >
          {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
        <IconButton
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: 1,
          }}
        >
          <SettingsIcon />
        </IconButton>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/habits"
          sx={{
            borderRadius: 2,
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
