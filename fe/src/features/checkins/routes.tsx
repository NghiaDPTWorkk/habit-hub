/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const CheckinsPage = lazy(() =>
  import('./components/CheckinsPage').then((m) => ({ default: m.CheckinsPage }))
)

export const checkinsRoutes: RouteObject[] = [
  {
    path: 'checkins',
    element: <CheckinsPage />,
  },
]
