import { useBoundStore } from '@/store'
import { SEED_HABITS, SEED_CHECKINS, SEED_GOALS, SEED_NOTES } from './seedData'
import { makeCheckinKey } from '@/store/checkinSlice'
import { currentStreak, totalCompletions } from '@/features/dashboard/services'

// Seeds the store with demo data on first load.
// Zustand persist hydrates synchronously from localStorage, so by the time
// this runs the store already reflects any previously saved data.
export function initStore(): void {
  const { habits } = useBoundStore.getState()
  if (habits.length > 0) return

  const checkinsRecord = Object.fromEntries(
    SEED_CHECKINS.map((c) => [makeCheckinKey(c.habitId, c.date), c])
  )

  const notifiedGoals: Record<string, boolean> = {}
  SEED_GOALS.forEach((goal) => {
    const habit = SEED_HABITS.find((h) => h.id === goal.habitId)
    if (habit) {
      const currentValue =
        goal.targetType === 'streak'
          ? currentStreak(habit, SEED_CHECKINS)
          : totalCompletions(habit, SEED_CHECKINS)
      const percentage = Math.round((currentValue / goal.targetValue) * 100)
      if (percentage >= 100) {
        notifiedGoals[`${goal.id}-completed`] = true
        notifiedGoals[`${goal.id}-80percent`] = true
      } else if (percentage >= 80) {
        notifiedGoals[`${goal.id}-80percent`] = true
      }
    }
  })

  useBoundStore.setState({
    habits: SEED_HABITS,
    checkins: checkinsRecord,
    goals: SEED_GOALS,
    notes: SEED_NOTES,
    notifiedGoals,
  })
}
