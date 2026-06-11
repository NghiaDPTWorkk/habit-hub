import type { HabitSlice } from './habitSlice'
import type { CheckinSlice } from './checkinSlice'
import type { GoalSlice } from './goalSlice'
import type { ThemeSlice } from './themeSlice'
import type { ToastSlice } from './toastSlice'

export type BoundStore = HabitSlice & CheckinSlice & GoalSlice & ThemeSlice & ToastSlice
