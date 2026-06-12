import { createBrowserRouter } from 'react-router-dom'
import { MainLayout, ReadOnlyLayout } from '@/components/layouts'
import { dashboardRoutes } from '@/features/dashboard'
import { habitsRoutes } from '@/features/habits'
import { goalsRoutes } from '@/features/goals'
import { checkinsRoutes } from '@/features/checkins'
import { settingsRoutes } from '@/features/settings'
import { ReadOnlyHabitsPage } from '@/features/habits'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      ...dashboardRoutes,
      ...habitsRoutes,
      ...goalsRoutes,
      ...checkinsRoutes,
      ...settingsRoutes,
    ],
  },
  {
    path: '/readonly',
    element: <ReadOnlyLayout />,
    children: [
      {
        path: 'habits',
        element: <ReadOnlyHabitsPage />,
      },
    ],
  },
])
