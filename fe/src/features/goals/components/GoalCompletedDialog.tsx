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

const CONTENT = {
  '100': {
    title: 'Goal Complete!',
    subtitle: 'You reached your target for',
    button: 'Awesome!',
    color: 'success' as const,
    bgcolor: 'success.main',
    icon: 'trophy' as const,
  },
  '80': {
    title: 'Almost There!',
    subtitle: "You're 80% of the way to your goal for",
    button: 'Keep it up!',
    color: 'warning' as const,
    bgcolor: 'warning.main',
    icon: 'trending' as const,
  },
}

interface GoalCompletedDialogProps {
  habitName: string | null
  onClose: () => void
  type?: '80' | '100'
}

export const GoalCompletedDialog: React.FC<GoalCompletedDialogProps> = ({
  habitName,
  onClose,
  type = '100',
}) => {
  const content = CONTENT[type]

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
            bgcolor: content.bgcolor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          {content.icon === 'trophy' ? (
            <Icons.EmojiEvents sx={{ fontSize: 36 }} />
          ) : (
            <Icons.TrendingUp sx={{ fontSize: 36 }} />
          )}
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {content.title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ textAlign: 'center', pb: 1 }}>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {content.subtitle}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
          {habitName ?? GOALS_CONTENT.UNKNOWN_HABIT}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button variant="contained" color={content.color} onClick={onClose} sx={{ px: 4 }}>
          {content.button}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
