import React from 'react'
import { Link as RouterLink, Outlet } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@/components/ui'
import { APP_CONSTANTS } from '@/constants'

export const MainLayout: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {APP_CONSTANTS.TITLE}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" component={RouterLink} to="/dashboard">
              {APP_CONSTANTS.NAVIGATION.DASHBOARD}
            </Button>
            <Button color="inherit" component={RouterLink} to="/habits">
              {APP_CONSTANTS.NAVIGATION.HABITS}
            </Button>
            <Button color="inherit" component={RouterLink} to="/goals">
              {APP_CONSTANTS.NAVIGATION.GOALS}
            </Button>
            <Button color="inherit" component={RouterLink} to="/checkins">
              {APP_CONSTANTS.NAVIGATION.CHECKINS}
            </Button>
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
          backgroundColor: '#f5f5f5',
          borderTop: '1px solid #e0e0e0',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
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
