/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { MainLayout, ReadOnlyLayout } from '@/components/layouts'
import { dashboardRoutes } from '@/features/dashboard'
import { habitsRoutes } from '@/features/habits'
import { goalsRoutes } from '@/features/goals'
import { checkinsRoutes } from '@/features/checkins'
import { settingsRoutes } from '@/features/settings'

const ReadOnlyHabitsPage = lazy(() =>
  import('./features/habits/components/ReadOnlyHabitsPage').then((m) => ({
    default: m.ReadOnlyHabitsPage,
  }))
)

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
