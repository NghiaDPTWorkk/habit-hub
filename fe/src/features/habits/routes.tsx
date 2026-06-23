import type { RouteObject } from 'react-router-dom'
import { HabitsPage } from './components/HabitsPage'

export const habitsRoutes: RouteObject[] = [
  {
    path: 'habits',
    element: <HabitsPage />,
  },
]
