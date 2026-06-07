import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@/components/layouts'
import { dashboardRoutes } from '@/features/dashboard'
import { habitsRoutes } from '@/features/habits'
import { goalsRoutes } from '@/features/goals'
import { checkinsRoutes } from '@/features/checkins'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [...dashboardRoutes, ...habitsRoutes, ...goalsRoutes, ...checkinsRoutes],
  },
])
