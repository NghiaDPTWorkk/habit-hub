import type { RouteObject } from 'react-router-dom'
import { SettingsPage } from './components/SettingsPage'

export const settingsRoutes: RouteObject[] = [
  {
    path: 'settings',
    element: <SettingsPage />,
  },
]
