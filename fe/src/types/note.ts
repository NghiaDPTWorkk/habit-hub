export interface Note {
  id: string
  habitId: number
  date: string // YYYY-MM-DD
  content: string
  createdAt: string
}

export type Notes = Note[]
