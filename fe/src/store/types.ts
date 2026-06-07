import type { HabitSlice } from './habitSlice'
import type { CheckinSlice } from './checkinSlice'
import type { GoalSlice } from './goalSlice'

export type BoundStore = HabitSlice & CheckinSlice & GoalSlice
