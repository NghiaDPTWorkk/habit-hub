/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const DashboardPage = lazy(() =>
  import('./components/DashboardPage').then((m) => ({ default: m.DashboardPage }))
)

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
