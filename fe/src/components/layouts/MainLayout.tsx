import React from 'react'
import { Link as RouterLink, Outlet } from 'react-router-dom'
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

const USER_INITIAL = 'U'

export const MainLayout: React.FC = () => {
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
            {APP_CONSTANTS.TITLE}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
            <IconButton color="inherit" sx={{ ml: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'background.paper',
                  color: 'primary.main',
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
          backgroundColor: 'primary.main',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" align="center" sx={{ color: 'primary.contrastText' }}>
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
