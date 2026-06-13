import { type FC, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { Box, Typography, alpha, IconButton } from '@/components/ui'
import { Card } from '@/components/ui/Card'
import { StatusPill } from '@/components/ui/StatusPill'
import { pxToRem } from '@/utils'
import EditNoteIcon from '@mui/icons-material/EditNote'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'

import { useCheckinStore } from '@/features/checkins/hooks/useCheckinStore'
import { useBoundStore } from '@/store'
import type { Habit } from '@/types'

import { HABIT_CARD_CONTENT } from '../constants/content'
import { getPriorityColor } from '../utils/habitHelpers'
import { HabitCardFooter } from './HabitCardFooter'
import { HabitNoteModal } from './HabitNoteModal'

const { SHORT_WEEK_DAYS, CARD_TEXTS } = HABIT_CARD_CONTENT

const TEXT_CATEGORY_LABEL = 'Category: '

export interface HabitCardProps {
  habit: Habit
  todayCheckin?: { completedCount: number }
  isMissed: boolean
  onEdit: (habit: Habit) => void
  onDelete: (habit: Habit) => void
  onPauseResume: (habit: Habit) => void
  onArchive: (habit: Habit) => void
}

export const HabitCard: FC<HabitCardProps> = ({
  habit,
  todayCheckin,
  isMissed,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme()
  const dueToday =
    habit.frequency === 'Daily' || (habit.specificDays?.includes(new Date().getDay()) ?? false)

  const { incrementCount, getCheckinByHabitAndDate, today, checkins } = useCheckinStore()
  const notes = useBoundStore((s) => s.notes)
  const addNote = useBoundStore((s) => s.addNote)
  const updateNote = useBoundStore((s) => s.updateNote)
  const deleteNote = useBoundStore((s) => s.deleteNote)

  const currentCheckin = getCheckinByHabitAndDate(habit.id, today) || todayCheckin
  const completedCount = currentCheckin?.completedCount ?? 0
  const accumulatedCount = Object.values(checkins || {}).filter(
    (c) => c.habitId === habit.id && c.completedCount > 0
  ).length
  const scheduledText =
    habit.frequency === 'Daily'
      ? CARD_TEXTS.daily
      : habit.specificDays?.map((d) => SHORT_WEEK_DAYS[d]).join(', ') || ''

  const priorityColor = getPriorityColor(habit.priority, theme)
  const isGoalReached = completedCount >= habit.targetPerDay

  const todayNote = notes.find((n) => n.habitId === habit.id && n.date === today)
  const [noteModalOpen, setNoteModalOpen] = useState(false)
  const [noteText, setNoteText] = useState('')

  const handleOpenNote = () => {
    setNoteText(todayNote?.content || '')
    setNoteModalOpen(true)
  }

  const handleSaveNote = () => {
    if (todayNote) {
      updateNote(todayNote.id, noteText)
    } else {
      addNote(habit.id, today, noteText)
    }
    setNoteModalOpen(false)
  }

  const handleDeleteNote = () => {
    if (todayNote) {
      deleteNote(todayNote.id)
    }
    setNoteModalOpen(false)
  }

  return (
    <Card
      variant="elevation"
      elevation={1}
      sx={{
        borderRadius: 2,
        borderLeft: `${pxToRem(4)} solid ${priorityColor}`,
        bgcolor: 'background.paper',
        p: { xs: 1.5, sm: 2 },
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: 2,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.25, sm: 1.5 } }}>
        {/* Header Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Box
              component="span"
              sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: priorityColor }}
            />
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, fontSize: pxToRem(15.5), color: 'text.primary' }}
            >
              {habit.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton onClick={() => onEdit(habit)} size="small" sx={{ color: 'text.secondary' }}>
              <EditNoteIcon />
            </IconButton>
            <IconButton onClick={() => onDelete(habit)} size="small" sx={{ color: 'error.main' }}>
              <DeleteOutlinedIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Title & Description */}
        <Box>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', fontSize: pxToRem(12), fontWeight: 500 }}
          >
            {TEXT_CATEGORY_LABEL}
            {habit.category}
          </Typography>

          {/* Status Badges Row */}
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mt: 1 }}>
            {habit.status !== 'Active' && (
              <StatusPill
                status={habit.status.toLowerCase() as 'active' | 'paused' | 'archived'}
                sx={{ fontSize: pxToRem(10) }}
              />
            )}
            {dueToday && (
              <Box
                sx={{
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                  px: 0.75,
                  py: 0.15,
                  borderRadius: pxToRem(3),
                  fontSize: pxToRem(10),
                  fontWeight: 600,
                }}
              >
                {CARD_TEXTS.dueToday}
              </Box>
            )}
            {isMissed && (
              <Box
                sx={{
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  color: theme.palette.error.main,
                  px: 0.75,
                  py: 0.15,
                  borderRadius: pxToRem(3),
                  fontSize: pxToRem(10),
                  fontWeight: 600,
                }}
              >
                {CARD_TEXTS.missed}
              </Box>
            )}
          </Box>

          {/* Today's Note Display */}
          {todayNote?.content && (
            <Box
              sx={{
                p: { xs: 1.25, sm: 1.5 },
                mt: 1.5,
                borderRadius: 1.5,
                backgroundColor: alpha(theme.palette.primary.main, 0.06),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  fontWeight: 700,
                  mb: 0.5,
                  color: 'primary.main',
                  fontSize: pxToRem(11),
                }}
              >
                {CARD_TEXTS.noteLabel}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  m: 0,
                  whiteSpace: 'pre-wrap',
                  color: 'text.primary',
                  fontSize: pxToRem(12),
                  lineHeight: 1.4,
                }}
              >
                {todayNote.content}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Footer Info & Quick Check-in Button */}
        <HabitCardFooter
          habit={habit}
          accumulatedCount={accumulatedCount}
          scheduledText={scheduledText}
          isGoalReached={isGoalReached}
          onCheckIn={() => incrementCount(habit.id, today)}
          onEditNote={handleOpenNote}
        />
      </Box>

      {/* Note Modal */}
      <HabitNoteModal
        open={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
        noteText={noteText}
        onNoteTextChange={setNoteText}
        existingNote={!!todayNote}
        title={CARD_TEXTS.noteLabel}
        cancelLabel={CARD_TEXTS.cancel}
        saveLabel={CARD_TEXTS.save}
        deleteLabel={CARD_TEXTS.delete}
        placeholder={CARD_TEXTS.notePlaceholder}
      />
    </Card>
  )
}

// Local state for notes modal
