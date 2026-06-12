/* eslint-disable react-refresh/only-export-components */
import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { getTheme } from '@/theme'
import { useBoundStore } from '@/store'
import { Toast } from '@/components/ui'
import { initStore } from '@/storage/initStore'

initStore()

const ThemeApp: React.FC = () => {
  const themeMode = useBoundStore((state) => state.themeMode) || 'light'
  const currentTheme = React.useMemo(() => getTheme(themeMode), [themeMode])

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
      <Toast />
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeApp />
  </StrictMode>
)
