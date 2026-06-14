/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const HabitsPage = lazy(() =>
  import('./components/HabitsPage').then((m) => ({ default: m.HabitsPage }))
)

export const habitsRoutes: RouteObject[] = [
  {
    path: 'habits',
    element: <HabitsPage />,
  },
]
