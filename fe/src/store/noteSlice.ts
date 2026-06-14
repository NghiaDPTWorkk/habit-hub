import type { StateCreator } from 'zustand'
import type { Note } from '@/types'
import type { BoundStore } from './types'

export interface NoteSlice {
  notes: Note[]
  addNote: (habitId: number, date: string, content: string) => void
  updateNote: (id: string, content: string) => void
  deleteNote: (id: string) => void
  findNote: (habitId: number, date: string) => Note | undefined
}

export const createNoteSlice: StateCreator<BoundStore, [], [], NoteSlice> = (set, get) => ({
  notes: [],

  addNote: (habitId, date, content) =>
    set((state) => ({
      notes: [
        ...state.notes,
        {
          id: Date.now().toString(),
          habitId,
          date,
          content,
          createdAt: new Date().toISOString(),
        },
      ],
    })),

  updateNote: (id, content) =>
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, content } : n)) as Note[],
    })),

  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id) as Note[],
    })),

  findNote: (habitId, date) =>
    get().notes.find((n) => n.habitId === habitId && n.date === date) as Note | undefined,
})
