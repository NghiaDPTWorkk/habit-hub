import { createTheme } from '@mui/material/styles'

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
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
  },
})

export default theme
