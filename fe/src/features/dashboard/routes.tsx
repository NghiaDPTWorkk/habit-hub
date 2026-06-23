import type { RouteObject } from 'react-router-dom'
import { DashboardPage } from './components/DashboardPage'

export const dashboardRoutes: RouteObject[] = [
  {
    path: '',
    element: <DashboardPage />,
  },
  {
    path: 'dashboard',
    element: <DashboardPage />,
  },
]
