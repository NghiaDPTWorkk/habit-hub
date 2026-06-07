import type { HabitSlice } from './habitSlice'
import type { CheckInSlice } from './checkinSlice'
import type { GoalSlice } from './goalSlice'
import type { MetaSlice } from './metaSlice'

export type BoundStore = HabitSlice & CheckInSlice & GoalSlice & MetaSlice
