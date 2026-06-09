import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface TypeBackground {
    dark: string
  }
}

export const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#059669',
        light: mode === 'light' ? '#ECFDF5' : 'rgba(5, 150, 105, 0.12)',
        dark: '#047857',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#7C3AED',
        light: mode === 'light' ? '#F5F3FF' : 'rgba(124, 58, 237, 0.12)',
        dark: '#6D28D9',
        contrastText: '#ffffff',
      },
      error: {
        main: '#E11D48',
        light: mode === 'light' ? '#FFF1F2' : 'rgba(225, 29, 72, 0.12)',
        dark: '#BE123C',
        contrastText: '#ffffff',
      },
      warning: {
        main: '#D97706',
        light: mode === 'light' ? '#FEF3C7' : 'rgba(217, 119, 6, 0.12)',
        dark: '#92400E',
        contrastText: '#ffffff',
      },
      success: {
        main: '#059669',
        light: mode === 'light' ? '#ECFDF5' : 'rgba(5, 150, 105, 0.12)',
        dark: '#047857',
        contrastText: '#ffffff',
      },
      info: {
        main: '#2563EB',
        light: mode === 'light' ? '#EFF6FF' : 'rgba(37, 99, 235, 0.12)',
        dark: '#1D4ED8',
        contrastText: '#ffffff',
      },
      background: {
        default: mode === 'light' ? '#F8FAFC' : '#0F172A',
        paper: mode === 'light' ? '#FFFFFF' : '#1E293B',
        dark: '#0F172A',
      },
      text: {
        primary: mode === 'light' ? '#1E293B' : '#F8FAFC',
        secondary: mode === 'light' ? '#64748B' : '#94A3B8',
      },
      divider: mode === 'light' ? '#e2e8f0' : '#334155',
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
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
        variants: [
          {
            props: { variant: 'contained', color: 'primary' },
            style: {
              '&:hover': {
                backgroundColor: '#10B981',
              },
            },
          },
          {
            props: { variant: 'contained', color: 'secondary' },
            style: {
              '&:hover': {
                backgroundColor: '#8B5CF6',
              },
            },
          },
          {
            props: { variant: 'contained', color: 'success' },
            style: {
              '&:hover': {
                backgroundColor: '#10B981',
              },
            },
          },
          {
            props: { variant: 'contained', color: 'error' },
            style: {
              '&:hover': {
                backgroundColor: '#F43F5E',
              },
            },
          },
          {
            props: { variant: 'contained', color: 'warning' },
            style: {
              '&:hover': {
                backgroundColor: '#F59E0B',
              },
            },
          },
          {
            props: { variant: 'contained', color: 'info' },
            style: {
              '&:hover': {
                backgroundColor: '#3B82F6',
              },
            },
          },
        ],
      },
    },
  })

export const theme = getTheme('light')

export default theme
