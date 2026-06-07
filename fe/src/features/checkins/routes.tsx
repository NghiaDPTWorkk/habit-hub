import type { RouteObject } from 'react-router-dom'
import { CheckinsPage } from './components/CheckinsPage'

export const checkinsRoutes: RouteObject[] = [
  {
    path: 'checkins',
    element: <CheckinsPage />,
  },
]
