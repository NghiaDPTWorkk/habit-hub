import { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import {
  MoreVertIcon,
  PauseIcon,
  PlayArrowIcon,
  ArchiveIcon,
  UnarchiveIcon,
  EditIcon,
  DeleteIcon,
} from '@/components/ui/icons'
import type { Habit } from '@/types'
import { changeStatus, deleteHabit } from '@/services/HabitsService'
import { useToast } from '@/hooks/useToast'
import { AppError } from '@/domain/AppError'
import { useBoundStore } from '@/store/useBoundStore'

const LABELS = {
  pause: 'Pause',
  resume: 'Resume',
  archive: 'Archive',
  restore: 'Restore',
  edit: 'Edit',
  delete: 'Delete',
  deleteTitle: 'Delete habit',
  cancel: 'Cancel',
  moreOptions: 'More options',
}

interface Props {
  habit: Habit
  onEdit: () => void
}

export function HabitOverflowMenu({ habit, onEdit }: Props) {
  const toast = useToast()
  const checkInsCount = useBoundStore(
    (s) => s.checkIns.filter((c) => c.habitId === habit.id).length
  )

  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  function close() {
    setAnchor(null)
  }

  function handleStatus(target: Habit['status']) {
    try {
      changeStatus(habit.id, target)
      toast.success(`Habit ${target.toLowerCase()}`)
    } catch (err) {
      toast.error(err instanceof AppError ? err.message : 'Failed to update status')
    }
    close()
  }

  function handleDelete() {
    try {
      deleteHabit(habit.id)
      toast.success('Habit deleted')
    } catch (err) {
      toast.error(err instanceof AppError ? err.message : 'Failed to delete habit')
    }
    setDeleteDialogOpen(false)
  }

  const deleteMessage = `This will permanently delete "${habit.name}" along with ${checkInsCount} check-in${checkInsCount !== 1 ? 's' : ''} and any associated goal.`

  return (
    <>
      <IconButton
        size="small"
        aria-label={LABELS.moreOptions}
        onClick={(e) => setAnchor(e.currentTarget)}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={close}>
        {habit.status === 'ACTIVE' && (
          <MenuItem onClick={() => handleStatus('PAUSED')}>
            <PauseIcon fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />
            {LABELS.pause}
          </MenuItem>
        )}
        {habit.status === 'PAUSED' && (
          <MenuItem onClick={() => handleStatus('ACTIVE')}>
            <PlayArrowIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
            {LABELS.resume}
          </MenuItem>
        )}
        {habit.status !== 'ARCHIVED' && (
          <MenuItem onClick={() => handleStatus('ARCHIVED')}>
            <ArchiveIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            {LABELS.archive}
          </MenuItem>
        )}
        {habit.status === 'ARCHIVED' && (
          <MenuItem onClick={() => handleStatus('ACTIVE')}>
            <UnarchiveIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
            {LABELS.restore}
          </MenuItem>
        )}
        <Divider />
        <MenuItem
          onClick={() => {
            close()
            onEdit()
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          {LABELS.edit}
        </MenuItem>
        <MenuItem
          onClick={() => {
            close()
            setDeleteDialogOpen(true)
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          {LABELS.delete}
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>{LABELS.deleteTitle}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {deleteMessage}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)}>{LABELS.cancel}</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            {LABELS.delete}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
