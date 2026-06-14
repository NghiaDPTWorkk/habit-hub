/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const GoalsPage = lazy(() =>
  import('./components/GoalsPage').then((m) => ({ default: m.GoalsPage }))
)

export const goalsRoutes: RouteObject[] = [
  {
    path: 'goals',
    element: <GoalsPage />,
  },
]
