import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { createHabitSlice } from '@/store/habitSlice'
import { createCheckinSlice } from '@/store/checkinSlice'
import { createGoalSlice } from '@/store/goalSlice'
import { createThemeSlice } from '@/store/themeSlice'
import { createToastSlice } from '@/store/toastSlice'

import type { BoundStore } from './types'

export const useBoundStore = create<BoundStore>()(
  persist(
    (...a) => ({
      ...createHabitSlice(...a),
      ...createCheckinSlice(...a),
      ...createGoalSlice(...a),
      ...createThemeSlice(...a),
      ...createToastSlice(...a),
    }),
    {
      name: 'habit-hub-storage',

      partialize: (state) => ({
        habits: state.habits,
        checkins: state.checkins,
        goals: state.goals,
      }),
    }
  )
)
