import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface TypeBackground {
    dark: string
  }
  interface SimplePaletteColorOptions {
    border?: string
  }
  interface PaletteColor {
    border?: string
  }
}

export const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#27ae60' : '#34d399',
        light: mode === 'light' ? '#e8f5e9' : 'rgba(39, 174, 96, 0.15)',
        dark: mode === 'light' ? '#1b5e20' : '#27ae60',
        contrastText: '#ffffff',
      },
      secondary: {
        main: mode === 'light' ? '#8250df' : '#8957e5',
        light: mode === 'light' ? '#f5f0ff' : 'rgba(137, 87, 229, 0.15)',
        dark: mode === 'light' ? '#6639b6' : '#a371f7',
        contrastText: '#ffffff',
      },
      error: {
        main: mode === 'light' ? '#cf222e' : '#f85149',
        light: mode === 'light' ? '#ffebe9' : 'rgba(248, 81, 73, 0.15)',
        dark: mode === 'light' ? '#a0111f' : '#da3633',
        contrastText: '#ffffff',
      },
      warning: {
        main: mode === 'light' ? '#f2994a' : '#ffb04f',
        light: mode === 'light' ? '#fff2e0' : 'rgba(242, 153, 74, 0.15)',
        dark: mode === 'light' ? '#9e3f00' : '#f2994a',
        contrastText: '#ffffff',
        border: mode === 'light' ? '#ffdbb3' : 'rgba(242, 153, 74, 0.25)',
      },
      success: {
        main: mode === 'light' ? '#27ae60' : '#34d399',
        light: mode === 'light' ? '#e8f5e9' : 'rgba(39, 174, 96, 0.15)',
        dark: mode === 'light' ? '#1b5e20' : '#27ae60',
        contrastText: '#ffffff',
      },
      info: {
        main: mode === 'light' ? '#0969da' : '#2f81f7',
        light: mode === 'light' ? '#ddf4ff' : 'rgba(47, 129, 247, 0.15)',
        dark: mode === 'light' ? '#0550ae' : '#58a6ff',
        contrastText: '#ffffff',
      },
      background: {
        default: mode === 'light' ? '#f6f8fa' : '#0d1117',
        paper: mode === 'light' ? '#ffffff' : '#161b22',
        dark: '#0d1117',
      },
      text: {
        primary: mode === 'light' ? '#1f2328' : '#e6edf3',
        secondary: mode === 'light' ? '#656d76' : '#7d8590',
      },
      divider: mode === 'light' ? 'rgba(31, 35, 40, 0.08)' : 'rgba(240, 246, 252, 0.08)',
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
      MuiPaper: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundImage: 'none',
            boxShadow: 'none',
            border:
              theme.palette.mode === 'light'
                ? '1px solid rgba(31, 35, 40, 0.08)'
                : '1px solid rgba(240, 246, 252, 0.08)',
          }),
        },
      },
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
            style: ({ theme }) => ({
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            }),
          },
          {
            props: { variant: 'contained', color: 'secondary' },
            style: ({ theme }) => ({
              '&:hover': {
                backgroundColor: theme.palette.secondary.dark,
              },
            }),
          },
          {
            props: { variant: 'contained', color: 'success' },
            style: ({ theme }) => ({
              '&:hover': {
                backgroundColor: theme.palette.success.dark,
              },
            }),
          },
          {
            props: { variant: 'contained', color: 'error' },
            style: ({ theme }) => ({
              '&:hover': {
                backgroundColor: theme.palette.error.dark,
              },
            }),
          },
          {
            props: { variant: 'contained', color: 'warning' },
            style: ({ theme }) => ({
              '&:hover': {
                backgroundColor: theme.palette.warning.dark,
              },
            }),
          },
          {
            props: { variant: 'contained', color: 'info' },
            style: ({ theme }) => ({
              '&:hover': {
                backgroundColor: theme.palette.info.dark,
              },
            }),
          },
        ],
      },
    },
  })

export const theme = getTheme('light')

export default theme
