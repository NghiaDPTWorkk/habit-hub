import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@/components/ui'
import { TextArea } from '@/components/ui'

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
}

export const HabitNoteModal: React.FC<HabitNoteModalProps> = ({
  open,
  onClose,
  onSave,
  onDelete,
  noteText,
  onNoteTextChange,
  existingNote,
  title,
  cancelLabel,
  saveLabel,
  deleteLabel,
  placeholder,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <TextArea
          value={noteText}
          onChange={(event) => onNoteTextChange(event.target.value)}
          placeholder={placeholder}
          rows={5}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="text" onClick={onClose}>
          {cancelLabel}
        </Button>
        {existingNote && onDelete && (
          <Button variant="outlined" color="error" onClick={onDelete}>
            {deleteLabel}
          </Button>
        )}
        <Button variant="contained" onClick={onSave}>
          {saveLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
