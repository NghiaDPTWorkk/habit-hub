import { useBoundStore } from '@/store'
import { SEED_HABITS, SEED_CHECKINS, SEED_GOALS } from './seedData'
import { makeCheckinKey } from '@/store/checkinSlice'

// Seeds the store with demo data on first load.
// Zustand persist hydrates synchronously from localStorage, so by the time
// this runs the store already reflects any previously saved data.
export function initStore(): void {
  const { habits } = useBoundStore.getState()
  if (habits.length > 0) return

  const checkinsRecord = Object.fromEntries(
    SEED_CHECKINS.map((c) => [makeCheckinKey(c.date, c.habitId), c])
  )

  useBoundStore.setState({
    habits: SEED_HABITS,
    checkins: checkinsRecord,
    goals: SEED_GOALS,
  })
}
