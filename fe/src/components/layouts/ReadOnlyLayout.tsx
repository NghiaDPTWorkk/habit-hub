import React from 'react'
import { Outlet } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Container, Box } from '@/components/ui'
import { Icons } from '@/components/ui/icons'

const READ_ONLY_LAYOUT_CONTENT = {
  TITLE: 'Habit Hub',
  BANNER_TEXT: 'Read-only View — You are viewing shared data. No changes can be made.',
  FOOTER_COPY: '© ',
  FOOTER_TEXT: ' Habit Hub. Built with React & Material UI.',
}

export const ReadOnlyLayout: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {READ_ONLY_LAYOUT_CONTENT.TITLE}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          bgcolor: 'warning.main',
          color: 'warning.contrastText',
          py: 1,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Icons.Lock />
        <Typography variant="body2">{READ_ONLY_LAYOUT_CONTENT.BANNER_TEXT}</Typography>
      </Box>

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet />
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'primary.main',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" align="center" sx={{ color: 'primary.contrastText' }}>
            {READ_ONLY_LAYOUT_CONTENT.FOOTER_COPY}
            {currentYear}
            {READ_ONLY_LAYOUT_CONTENT.FOOTER_TEXT}
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}
