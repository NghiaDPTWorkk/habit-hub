import { createTheme } from '@mui/material/styles'
import type { Category, Priority } from '@/types'

declare module '@mui/material/styles' {
  interface TypeBackground {
    dark: string
  }
}

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#8c7ae6',
      light: '#b07cf0',
      dark: '#6c5ce7',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#718093',
      light: '#f5f6fa',
      dark: '#2f3640',
      contrastText: '#ffffff',
    },
    error: {
      main: '#f43f5e',
      light: '#fecdd3',
      dark: '#be123c',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f59e0b',
      light: '#fef3c7',
      dark: '#b45309',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981',
      light: '#a7f3d0',
      dark: '#047857',
      contrastText: '#ffffff',
    },
    info: {
      main: '#3b82f6',
      light: '#dbeafe',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
      dark: '#0f172a',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0, variant: 'outlined' },
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600 } },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: '#8c7ae6',
          borderBottom: '1px solid #e2e8f0',
          color: '#ffffff',
        },
      },
    },
  },
})

export const CATEGORY_COLORS: Record<Category, string> = {
  HEALTH: '#f43f5e',
  STUDY: '#6366f1',
  WORK: '#f59e0b',
  MINDFULNESS: '#a78bfa',
  OTHER: '#64748b',
}

export const CATEGORY_BG: Record<Category, string> = {
  HEALTH: '#fff1f2',
  STUDY: '#eef2ff',
  WORK: '#fffbeb',
  MINDFULNESS: '#f5f3ff',
  OTHER: '#f8fafc',
}

export const PRIORITY_COLORS: Record<Priority, string> = {
  HIGH: '#f43f5e',
  MEDIUM: '#f59e0b',
  LOW: '#64748b',
}

export const STATUS_COLORS = {
  ACTIVE: '#10b981',
  PAUSED: '#f59e0b',
  ARCHIVED: '#94a3b8',
}

export const COMPLETION_COLORS = {
  NOT_STARTED: '#94a3b8',
  IN_PROGRESS: '#f59e0b',
  COMPLETED: '#10b981',
}

export default theme
