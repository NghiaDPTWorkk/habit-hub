import React, { useState } from 'react'
import NoteIcon from '@mui/icons-material/Note'
import Chip from '@mui/material/Chip'
import { useTheme, alpha } from '@mui/material/styles'
import { Box, Button, IconButton } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { Card } from '@/components/ui/Card'
import type { Habit } from '@/types'
import { useBoundStore } from '@/store'
import { HabitNoteModal } from './HabitNoteModal'

const CARD_TEXTS = {
  scheduled: 'Scheduled on',
  dueToday: 'Due today.',
  missed: 'Missed today',
  completed: 'Completed',
  today: 'today',
  edit: 'Edit',
  delete: 'Delete',
  pause: 'Pause',
  resume: 'Resume',
  restore: 'Restore',
  archive: 'Archive',
  daily: 'Daily',
  specificDays: 'Specific days',
  targetLabel: 'Target:',
  priorityLabel: 'Priority:',
  statusLabel: 'Status:',
  dot: '.',
  slash: '/',
  noteLabel: 'Note today:',
  addNote: 'Add note',
  editNote: 'Edit note',
  notePlaceholder: 'Write your note here...',
  cancel: 'Cancel',
  save: 'Save',
}

const WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export interface HabitCardProps {
  habit: Habit
  todayCheckin?: { completedCount: number }
  isMissed: boolean
  onEdit: (habit: Habit) => void
  onDelete: (habitId: number) => void
  onPauseResume: (habit: Habit) => void
  onArchive: (habit: Habit) => void
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  todayCheckin,
  isMissed,
  onEdit,
  onDelete,
  onPauseResume,
  onArchive,
}) => {
  const theme = useTheme()
  const { notes, addNote, updateNote, deleteNote } = useBoundStore((state) => ({
    notes: state.notes,
    addNote: state.addNote,
    updateNote: state.updateNote,
    deleteNote: state.deleteNote,
  }))

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [noteText, setNoteText] = useState('')

  const todayStr = new Date().toISOString().split('T')[0]
  const existingNote = notes.find((note) => note.habitId === habit.id && note.date === todayStr)
  const dueToday =
    habit.frequency === 'Daily' || (habit.specificDays?.includes(new Date().getDay()) ?? false)
  const nextStatusAction =
    habit.status === 'Paused'
      ? CARD_TEXTS.resume
      : habit.status === 'Archived'
        ? CARD_TEXTS.restore
        : CARD_TEXTS.pause

  const handleOpenNote = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setNoteText(existingNote?.content ?? '')
    setIsNoteModalOpen(true)
  }

  const handleCloseNote = () => setIsNoteModalOpen(false)

  const handleSaveNote = () => {
    const trimmed = noteText.trim()
    if (!trimmed) return
    if (existingNote) {
      updateNote(existingNote.id, trimmed)
    } else {
      addNote(habit.id, todayStr, trimmed)
    }
    setIsNoteModalOpen(false)
  }

  const handleDeleteNote = () => {
    if (!existingNote) return
    deleteNote(existingNote.id)
    setNoteText('')
    setIsNoteModalOpen(false)
  }

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          borderColor: isMissed ? theme.palette.error.main : theme.palette.divider,
          backgroundColor: isMissed
            ? alpha(theme.palette.error.main, 0.08)
            : theme.palette.background.paper,
          p: 2,
        }}
      >
        <Box sx={{ display: 'grid', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box>
              <Box
                component="h3"
                sx={{ ...theme.typography.subtitle1, fontWeight: 700, margin: 0, mb: 1 }}
              >
                {habit.name}
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                <Chip label={habit.category} size="small" />
                <Chip
                  label={habit.frequency === 'Daily' ? CARD_TEXTS.daily : CARD_TEXTS.specificDays}
                  size="small"
                />
                <Chip label={`${CARD_TEXTS.targetLabel} ${habit.targetPerDay}`} size="small" />
                <Chip label={`${CARD_TEXTS.priorityLabel} ${habit.priority}`} size="small" />
                <Chip label={`${CARD_TEXTS.statusLabel} ${habit.status}`} size="small" />
              </Box>
            </Box>
            <IconButton
              aria-label={existingNote ? CARD_TEXTS.editNote : CARD_TEXTS.addNote}
              onClick={handleOpenNote}
            >
              <NoteIcon />
            </IconButton>
          </Box>

          {habit.frequency === 'Specific' && habit.specificDays?.length && (
            <Box
              component="p"
              sx={{ ...theme.typography.body2, color: theme.palette.text.secondary, mb: 1, m: 0 }}
            >
              {CARD_TEXTS.scheduled}{' '}
              {habit.specificDays
                .map((day) => WEEK_DAYS[day])
                .filter(Boolean)
                .join(', ')}
              {CARD_TEXTS.dot}
            </Box>
          )}

          {dueToday && (
            <Box
              component="p"
              sx={{ ...theme.typography.body2, color: theme.palette.text.secondary, mb: 0.5, m: 0 }}
            >
              {CARD_TEXTS.dueToday}
            </Box>
          )}

          {isMissed && (
            <Box
              component="p"
              sx={{
                ...theme.typography.body2,
                color: theme.palette.error.main,
                fontWeight: 600,
                mb: 0.5,
                m: 0,
              }}
            >
              {CARD_TEXTS.missed}
            </Box>
          )}

          {todayCheckin && !isMissed && dueToday && (
            <Box
              component="p"
              sx={{ ...theme.typography.body2, color: theme.palette.success.main, mb: 0.5, m: 0 }}
            >
              {CARD_TEXTS.completed} {todayCheckin.completedCount} {CARD_TEXTS.slash}{' '}
              {habit.targetPerDay} {CARD_TEXTS.today}
            </Box>
          )}

          {existingNote && (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.06),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
              }}
            >
              <Box component="strong" sx={{ display: 'block', mb: 0.5, fontSize: 0.95 }}>
                {CARD_TEXTS.noteLabel}
              </Box>
              <Box
                component="p"
                sx={{ m: 0, whiteSpace: 'pre-wrap', color: theme.palette.text.primary }}
              >
                {existingNote.content}
              </Box>
            </Box>
          )}

          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexWrap: 'wrap', gap: 1 }}>
            <Button variant="outlined" onClick={() => onEdit(habit)}>
              {CARD_TEXTS.edit}
            </Button>
            <Button variant="outlined" color="error" onClick={() => onDelete(habit.id)}>
              {CARD_TEXTS.delete}
            </Button>
            <Button variant="contained" onClick={() => onPauseResume(habit)}>
              {nextStatusAction}
            </Button>
            {habit.status !== 'Archived' && (
              <Button variant="outlined" onClick={() => onArchive(habit)}>
                {CARD_TEXTS.archive}
              </Button>
            )}
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <IconButton onClick={() => onEdit(habit)}>
              <Icons.Edit />
            </IconButton>
            <IconButton color="error" onClick={() => onDelete(habit.id)}>
              <Icons.Delete />
            </IconButton>
            <IconButton onClick={() => onPauseResume(habit)}>
              {habit.status === 'Active' ? <Icons.Pause /> : <Icons.Play />}
            </IconButton>
            {habit.status !== 'Archived' && (
              <IconButton onClick={() => onArchive(habit)}>
                <Icons.Archive />
              </IconButton>
            )}
          </Box>
        </Box>
      </Card>

      <HabitNoteModal
        open={isNoteModalOpen}
        onClose={handleCloseNote}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
        noteText={noteText}
        onNoteTextChange={setNoteText}
        existingNote={!!existingNote}
        title={existingNote ? CARD_TEXTS.editNote : CARD_TEXTS.addNote}
        cancelLabel={CARD_TEXTS.cancel}
        saveLabel={CARD_TEXTS.save}
        deleteLabel={CARD_TEXTS.delete}
        placeholder={CARD_TEXTS.notePlaceholder}
      />
    </>
  )
}
