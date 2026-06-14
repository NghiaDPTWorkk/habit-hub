import type { HabitSlice } from './habitSlice'
import type { CheckinSlice } from './checkinSlice'
import type { GoalSlice } from './goalSlice'
import type { ThemeSlice } from './themeSlice'
import type { ToastSlice } from './toastSlice'

type SliceKeys<T> = keyof T

type SharesKeys<A, B> = SliceKeys<A> & SliceKeys<B> extends never ? false : true

type AssertNoOverlap<T extends false> = T

type _NsGuard = AssertNoOverlap<
  | SharesKeys<HabitSlice, CheckinSlice>
  | SharesKeys<HabitSlice, GoalSlice>
  | SharesKeys<HabitSlice, ThemeSlice>
  | SharesKeys<HabitSlice, ToastSlice>
  | SharesKeys<CheckinSlice, GoalSlice>
  | SharesKeys<CheckinSlice, ThemeSlice>
  | SharesKeys<CheckinSlice, ToastSlice>
  | SharesKeys<GoalSlice, ThemeSlice>
  | SharesKeys<GoalSlice, ToastSlice>
  | SharesKeys<ThemeSlice, ToastSlice>
>

declare const _nsGuard: _NsGuard

export type BoundStore = HabitSlice & CheckinSlice & GoalSlice & ThemeSlice & ToastSlice
