import { createBrowserRouter, Navigate } from 'react-router-dom'
import { MainLayout } from '@/components/layouts/MainLayout'
import { HabitsPage } from '@/features/habits/pages/HabitsPage'
import { CheckInsPage } from '@/features/checkins/pages/CheckInsPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { NotFound } from './NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'habits', element: <HabitsPage /> },
      { path: 'check-ins', element: <CheckInsPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
