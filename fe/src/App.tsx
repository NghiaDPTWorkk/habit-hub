import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'
import { ToastProvider } from '@/components/ui/ToastProvider'
import { useEffect } from 'react'
import { useBoundStore } from '@/store/useBoundStore'
import { applySeedData } from '@/storage/seedData'

function SeedInitializer() {
  const seededAt = useBoundStore((s) => s.seededAt)
  const habits = useBoundStore((s) => s.habits)

  useEffect(() => {
    if (!seededAt && habits.length === 0) {
      applySeedData(useBoundStore.getState())
    }
  }, [seededAt, habits.length])

  return null
}

export function App() {
  return (
    <>
      <SeedInitializer />
      <RouterProvider router={router} />
      <ToastProvider />
    </>
  )
}
