import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Divider,
} from '@/components/ui'
import { TextArea } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { pxToRem } from '@/utils'

interface HabitNoteModalProps {
  open: boolean
  onClose: () => void
  onSave: () => void
  onDelete?: () => void
  noteText: string
  onNoteTextChange: (text: string) => void
  existingNote?: boolean
  title: string
  cancelLabel: string
  saveLabel: string
  deleteLabel: string
  placeholder: string
  habitName?: string
  date?: string
}

const TEXT_MODAL_TITLE = 'Daily Journal & Notes'
const TEXT_LABEL_REFLECTIONS = 'Write notes for today (reflections, metrics...)'
const TEXT_METADATA_HABIT = 'Habit: '
const TEXT_METADATA_DATE = 'Date: '
const TEXT_SEPARATOR = ' | '

const DIALOG_PAPER_SX = {
  borderRadius: pxToRem(16),
  p: 0,
  width: '100%',
  maxWidth: pxToRem(450),
}

const HEADER_BOX_SX = {
  display: 'flex',
  flexDirection: 'column',
  px: 3,
  pt: 3,
  pb: 2,
}

const TITLE_ROW_SX = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}

const TITLE_CONTENT_SX = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
}

const TITLE_ICON_SX = {
  color: 'text.primary',
  fontSize: pxToRem(24),
}

const TITLE_TEXT_SX = {
  fontWeight: 700,
  fontSize: pxToRem(20),
  color: 'text.primary',
}

const CLOSE_BTN_SX = {
  bgcolor: 'action.hover',
  color: 'text.secondary',
  '&:hover': {
    bgcolor: 'action.selected',
  },
}

const METADATA_TEXT_SX = {
  color: 'text.secondary',
  mt: 1.5,
  fontSize: pxToRem(14),
  fontWeight: 500,
}

const DIVIDER_SX = {
  mx: 0,
  my: 0,
  borderColor: 'rgba(0, 0, 0, 0.08)',
}

const CONTENT_SX = {
  px: 3,
  py: 2.5,
  borderBottom: 'none',
}

const LABEL_TEXT_SX = {
  color: 'text.secondary',
  mb: 1.25,
  fontSize: pxToRem(14),
  fontWeight: 500,
}

const TEXTAREA_SX = {
  '& .MuiOutlinedInput-root': {
    borderRadius: pxToRem(8),
    backgroundColor: 'transparent',
    '& fieldset': {
      borderColor: '#a3cca3', // brighter soft green default border
    },
    '&:hover fieldset': {
      borderColor: '#62b662',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#62b662',
      borderWidth: pxToRem(1.5),
    },
  },
}

const DELETE_BTN_SX = {
  color: '#A53F3F',
  borderColor: '#FFE3E3',
  bgcolor: '#FFF2F2',
  borderRadius: pxToRem(8),
  textTransform: 'none',
  fontWeight: 600,
  px: 2.5,
  py: 1,
  '&:hover': {
    borderColor: '#FCDEDE',
    bgcolor: '#FFEBEB',
  },
}

const CANCEL_BTN_SX = {
  color: 'text.primary',
  borderColor: '#CBD5E0',
  borderRadius: pxToRem(8),
  textTransform: 'none',
  fontWeight: 600,
  px: 2.5,
  py: 1,
  '&:hover': {
    borderColor: '#A0AEC0',
    bgcolor: 'action.hover',
  },
}

const SAVE_BTN_SX = {
  color: '#FFFFFF',
  bgcolor: '#62b662', // brighter, fresher green
  borderRadius: pxToRem(8),
  textTransform: 'none',
  fontWeight: 600,
  px: 2.5,
  py: 1,
  boxShadow: 'none',
  '&:hover': {
    bgcolor: '#52a652',
    boxShadow: 'none',
  },
}

export const HabitNoteModal: React.FC<HabitNoteModalProps> = ({
  open,
  onClose,
  onSave,
  onDelete,
  noteText,
  onNoteTextChange,
  existingNote,
  cancelLabel,
  saveLabel,
  deleteLabel,
  placeholder,
  habitName,
  date,
}) => {
  const showDelete = existingNote !== false && !!onDelete

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: DIALOG_PAPER_SX,
        },
      }}
    >
      {/* Custom Header */}
      <Box sx={HEADER_BOX_SX}>
        <Box sx={TITLE_ROW_SX}>
          <Box sx={TITLE_CONTENT_SX}>
            <Icons.Edit sx={TITLE_ICON_SX} />
            <Typography variant="h6" sx={TITLE_TEXT_SX}>
              {TEXT_MODAL_TITLE}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={CLOSE_BTN_SX}>
            <Icons.Close fontSize="small" />
          </IconButton>
        </Box>

        {/* Metadata: Habit and Date */}
        {(habitName || date) && (
          <Typography variant="body2" sx={METADATA_TEXT_SX}>
            {habitName ? `${TEXT_METADATA_HABIT}${habitName}` : ''}
            {habitName && date ? TEXT_SEPARATOR : ''}
            {date ? `${TEXT_METADATA_DATE}${date}` : ''}
          </Typography>
        )}
      </Box>

      <Divider sx={DIVIDER_SX} />

      <DialogContent sx={CONTENT_SX}>
        <Typography variant="body2" sx={LABEL_TEXT_SX}>
          {TEXT_LABEL_REFLECTIONS}
        </Typography>

        <TextArea
          value={noteText}
          onChange={(event) => onNoteTextChange(event.target.value)}
          placeholder={placeholder}
          rows={5}
          sx={TEXTAREA_SX}
        />
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          pt: 1,
          display: 'flex',
          justifyContent: showDelete ? 'space-between' : 'flex-end',
          alignItems: 'center',
        }}
      >
        {showDelete && (
          <Button variant="outlined" onClick={onDelete} sx={DELETE_BTN_SX}>
            {deleteLabel || 'Delete Note'}
          </Button>
        )}
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" onClick={onClose} sx={CANCEL_BTN_SX}>
            {cancelLabel}
          </Button>
          <Button variant="contained" onClick={onSave} sx={SAVE_BTN_SX}>
            {saveLabel}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}
