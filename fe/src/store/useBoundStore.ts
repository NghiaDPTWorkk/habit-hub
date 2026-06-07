import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createHabitSlice } from '@/store/habitSlice'
import { createCheckinSlice } from '@/store/checkinSlice'
import { createGoalSlice } from '@/store/goalSlice'
import type { BoundStore } from './types'

export const useBoundStore = create<BoundStore>()(
  // selector pattern zustands
  persist(
    (...a) => ({
      ...createHabitSlice(...a),
      ...createCheckinSlice(...a),
      ...createGoalSlice(...a),
    }),
    {
      name: 'habit-hub-storage',
    }
  )
)
