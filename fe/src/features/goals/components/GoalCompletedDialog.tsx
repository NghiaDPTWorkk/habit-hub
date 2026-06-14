import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { GOALS_CONTENT } from '../constants/content'

const DIALOG_TITLE = 'Goal Complete!'
const DIALOG_SUBTITLE = 'You reached your target for'
const CONFIRM_BUTTON = 'Awesome!'

interface GoalCompletedDialogProps {
  habitName: string | null
  onClose: () => void
}

export const GoalCompletedDialog: React.FC<GoalCompletedDialogProps> = ({ habitName, onClose }) => {
  return (
    <Dialog open={!!habitName} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', pt: 4, pb: 1 }}>
        <Box
          sx={{
            mx: 'auto',
            mb: 2,
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: 'success.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <Icons.EmojiEvents sx={{ fontSize: 36 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {DIALOG_TITLE}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ textAlign: 'center', pb: 1 }}>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {DIALOG_SUBTITLE}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
          {habitName ?? GOALS_CONTENT.UNKNOWN_HABIT}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button variant="contained" color="success" onClick={onClose} sx={{ px: 4 }}>
          {CONFIRM_BUTTON}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
