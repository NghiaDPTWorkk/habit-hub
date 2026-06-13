import React from 'react'
import { Box, Typography, Card, IconButton, Tooltip, Checkbox } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { useCheckinStore } from '../hooks'
import type { Habit, Checkin } from '@/types'
import { pxToRem } from '@/utils'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useBoundStore } from '@/store'
import { HabitNoteModal } from '@/features/habits/components'

const LABEL_CATEGORY = 'Category: '
const LABEL_PRIORITY = ' | Priority: '
const LABEL_EDIT = 'Edit Progress'
const LABEL_CHECKIN = 'Check-in'
const LABEL_OVERDUE = 'Overdue'
const LABEL_STREAK_AT_RISK = 'Streak at risk'

const CATEGORY_THEME_COLORS: Record<string, string> = {
  Health: 'success.main',
  Study: 'info.main',
  Work: 'primary.main',
  Mindfulness: 'secondary.main',
  Other: 'warning.main',
}

export interface CheckinItemCardProps {
  habit: Habit
  checkin: Checkin | undefined
  today: string
  onOpenModal: () => void
  isAtRisk?: boolean
}

export const CheckinItemCard: React.FC<CheckinItemCardProps> = ({
  habit,
  checkin,
  today,
  onOpenModal,
  isAtRisk = false,
}) => {
  const [noteOpen, setNoteOpen] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [noteId, setNoteId] = useState('')

  const storeAddNote = useBoundStore((s) => s.addNote)
  const storeUpdateNote = useBoundStore((s) => s.updateNote)
  const storeDeleteNote = useBoundStore((s) => s.deleteNote)

  const openNoteForDate = (date: string) => {
    const existing = useBoundStore
      .getState()
      .notes.find((n) => n.habitId === habit.id && n.date === date)
    setNoteText(existing?.content ?? '')
    setNoteId(existing?.id ?? '')
    setNoteOpen(true)
  }

  const handleSaveNote = () => {
    if (noteId) storeUpdateNote(noteId, noteText)
    else storeAddNote(habit.id, today, noteText)
    setNoteOpen(false)
  }

  const handleDeleteNote = () => {
    if (noteId) storeDeleteNote(noteId)
    setNoteText('')
    setNoteId('')
    setNoteOpen(false)
  }

  const { markComplete, upsertCheckin } = useCheckinStore()
  const completedCount = checkin?.completedCount ?? 0
  const isChecked = checkin?.status === 'Completed'

  const handleToggle = () => {
    if (isChecked) {
      upsertCheckin(habit.id, today, { completedCount: 0, status: 'Not Started' })
    } else {
      markComplete(habit.id, today)
    }
  }

  const categoryColor = CATEGORY_THEME_COLORS[habit.category] || 'text.secondary'
  const progressText =
    habit.targetPerDay > 1 ? ` | Progress: ${completedCount}/${habit.targetPerDay}` : ''
  const subtitleText = `${LABEL_CATEGORY}${habit.category}${LABEL_PRIORITY}${habit.priority}${progressText}`

  const isPastDate = dayjs(today).isBefore(dayjs(), 'day')
  const isOverdue = isPastDate && !isChecked

  return (
    <Card
      sx={{
        p: 2,
        borderLeft: isAtRisk || isOverdue ? '4px solid' : undefined,
        borderLeftColor: isAtRisk ? 'error.main' : isOverdue ? 'warning.main' : undefined,
        bgcolor: isOverdue ? 'warning.light' : undefined,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left Part: Dot and Title/Subtitle */}
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1, pr: 2 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: categoryColor,
              mr: 1.5,
              flexShrink: 0,
            }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {habit.name}
              </Typography>
              {isOverdue && (
                <Box
                  sx={{
                    px: 1,
                    py: 0.25,
                    bgcolor: 'error.light',
                    color: 'error.dark',
                    borderRadius: 1,
                    fontSize: pxToRem(10),
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    lineHeight: 1,
                  }}
                >
                  {LABEL_OVERDUE}
                </Box>
              )}
              {isAtRisk && (
                <Box
                  sx={{
                    px: 1,
                    py: 0.25,
                    bgcolor: 'error.light',
                    color: 'error.dark',
                    borderRadius: 1,
                    fontSize: pxToRem(10),
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    lineHeight: 1,
                  }}
                >
                  {LABEL_STREAK_AT_RISK}
                </Box>
              )}
            </Box>
            <Typography variant="caption" color="text.secondary">
              {subtitleText}
            </Typography>
          </Box>
        </Box>

        {/* Right Part: Edit and Checkin Toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          <Tooltip title={LABEL_EDIT}>
            <IconButton size="small" onClick={onOpenModal}>
              <Icons.Edit fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Note">
            <IconButton size="small" onClick={() => openNoteForDate(today)}>
              <Icons.Edit fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title={LABEL_CHECKIN}>
            <Checkbox
              checked={isChecked}
              onChange={handleToggle}
              sx={{
                color: 'action.disabled',
                p: 0.5,
                '&.Mui-checked': {
                  color: 'success.main',
                },
              }}
            />
          </Tooltip>
        </Box>
      </Box>
      <HabitNoteModal
        open={noteOpen}
        noteText={noteText}
        onNoteTextChange={setNoteText}
        onSave={handleSaveNote}
        onDelete={noteId ? handleDeleteNote : undefined}
        onClose={() => setNoteOpen(false)}
        title={`${habit.name} - Note (${today})`}
        placeholder="Write your note here..."
        saveLabel="Save"
        cancelLabel="Cancel"
        deleteLabel="Delete"
      />
    </Card>
  )
}
