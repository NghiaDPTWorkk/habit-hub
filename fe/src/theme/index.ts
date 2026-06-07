import { createTheme } from '@mui/material/styles'
import type { Category, Priority } from '@/types'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#10b981', contrastText: '#fff' }, // emerald — active/success
    secondary: { main: '#6366f1', contrastText: '#fff' }, // indigo — study/accent
    warning: { main: '#f59e0b', contrastText: '#fff' }, // amber — at-risk/paused/medium
    error: { main: '#f43f5e', contrastText: '#fff' }, // rose — errors/high/delete
    info: { main: '#a78bfa', contrastText: '#fff' }, // violet — mindfulness
    success: { main: '#10b981', contrastText: '#fff' }, // emerald
    text: { primary: '#0f172a', secondary: '#64748b' },
    background: { default: '#f8fafc', paper: '#ffffff' },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
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
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          color: '#0f172a',
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
