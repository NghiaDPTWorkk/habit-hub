import type { RouteObject } from 'react-router-dom'
import { GoalsPage } from './components/GoalsPage'

export const goalsRoutes: RouteObject[] = [
  {
    path: 'goals',
    element: <GoalsPage />,
  },
]
