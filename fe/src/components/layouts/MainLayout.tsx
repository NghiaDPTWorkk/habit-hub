import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import { SettingsIcon, DashboardIcon } from '@/components/ui/icons'
import { resetToSeed } from '@/services/admin'
import { useToast } from '@/hooks/useToast'

const BRAND = 'Habit Hub'
const RESET_MENU_LABEL = 'Reset all data'
const RESET_DIALOG_TITLE = 'Reset all data'
const RESET_DESCRIPTION =
  'This will permanently delete all your habits, check-ins, and goals and restore the demo seed data. Type RESET to confirm.'
const RESET_PLACEHOLDER = 'Type RESET'
const CONFIRM_KEYWORD = 'RESET'
const CANCEL_LABEL = 'Cancel'
const CONFIRM_LABEL = 'Confirm reset'
const RESET_TOAST = 'Data reset to seed state'

const NAV_LINKS = [
  { label: 'Habits', to: '/habits' },
  { label: 'Check-ins', to: '/check-ins' },
  { label: 'Dashboard', to: '/dashboard' },
]

export function MainLayout() {
  const navigate = useNavigate()
  const toast = useToast()
  const currentYear = new Date().getFullYear()

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [resetInput, setResetInput] = useState('')

  function handleReset() {
    resetToSeed()
    toast.success(RESET_TOAST)
    setResetDialogOpen(false)
    setResetInput('')
    navigate('/dashboard')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'primary.main',
          borderBottom: '1px solid',
          borderColor: 'primary.dark',
          color: '#ffffff',
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 3 }}>
            <DashboardIcon sx={{ color: '#ffffff' }} />
            <Typography sx={{ color: '#ffffff', fontWeight: 700, fontSize: 18 }}>
              {BRAND}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 0.5, flexGrow: 1 }}>
            {NAV_LINKS.map(({ label, to }) => (
              <Button
                key={to}
                component={NavLink}
                to={to}
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  textTransform: 'none',
                  '&.active': {
                    color: '#ffffff',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    fontWeight: 700,
                  },
                }}
              >
                {label}
              </Button>
            ))}
          </Box>

          <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} size="small" sx={{ color: '#ffffff' }}>
            <SettingsIcon fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
          >
            <MenuItem
              onClick={() => {
                setMenuAnchor(null)
                setResetDialogOpen(true)
              }}
              sx={{ color: 'error.main' }}
            >
              {RESET_MENU_LABEL}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
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
          <Typography variant="body2" align="center" sx={{ color: '#ffffff' }}>
            © {currentYear} Habit Hub. All rights reserved.
          </Typography>
        </Container>
      </Box>

      <Dialog
        open={resetDialogOpen}
        onClose={() => {
          setResetDialogOpen(false)
          setResetInput('')
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>{RESET_DIALOG_TITLE}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {RESET_DESCRIPTION}
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder={RESET_PLACEHOLDER}
            value={resetInput}
            onChange={(e) => setResetInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setResetDialogOpen(false)
              setResetInput('')
            }}
          >
            {CANCEL_LABEL}
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={resetInput !== CONFIRM_KEYWORD}
            onClick={handleReset}
          >
            {CONFIRM_LABEL}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
