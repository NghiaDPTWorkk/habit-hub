import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createHabitSlice } from '@/store/habitSlice'
import { createCheckinSlice } from '@/store/checkinSlice'
import { createGoalSlice } from '@/store/goalSlice'
import { createMetaSlice } from '@/store/metaSlice'
import type { BoundStore } from './types'

// useBoundStore is both the React hook and the store reference.
// Services outside React can call useBoundStore.getState() / useBoundStore.setState().
export const useBoundStore = create<BoundStore>()(
  // selector pattern zustands
  persist(
    (...a) => ({
      ...createHabitSlice(...a),
      ...createCheckinSlice(...a),
      ...createGoalSlice(...a),
      ...createMetaSlice(...a),
    }),
    {
      name: 'habit-hub-storage',
      version: 1,
      // Clear stale data from old schema (pre-typed IDs were numbers)
      migrate(persistedState, version) {
        if (version < 1) {
          return { seededAt: null, habits: [], checkIns: [], goals: [] }
        }
        return persistedState as BoundStore
      },
    }
  )
)
