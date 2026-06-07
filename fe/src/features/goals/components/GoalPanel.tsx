import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import { EmojiEventsIcon, TrackChangesIcon } from '@/components/ui/icons'
import type { Goal } from '@/types'
import { TARGET_TYPE_LABELS } from '@/types'
import { GoalFormInline } from './GoalFormInline'

const SET_GOAL_LABEL = 'Set a goal'
const GOAL_PREFIX = 'GOAL ·'
const ACHIEVED_LABEL = 'Achieved!'
const TO_GO_LABEL = 'to go'
const PCT_SUFFIX = '%'

interface Props {
  habitId: string
  goal: Goal | null
}

export function GoalPanel({ habitId, goal }: Props) {
  const [showForm, setShowForm] = useState(false)

  if (!goal && !showForm) {
    return (
      <Box sx={{ pt: 1 }}>
        <Button
          size="small"
          startIcon={<TrackChangesIcon fontSize="small" />}
          onClick={() => setShowForm(true)}
          sx={{ color: 'text.secondary' }}
        >
          {SET_GOAL_LABEL}
        </Button>
      </Box>
    )
  }

  if (showForm) {
    return (
      <Box sx={{ pt: 1 }}>
        <Divider sx={{ mb: 2 }} />
        <GoalFormInline
          habitId={habitId}
          onCreated={() => setShowForm(false)}
          onCancel={() => setShowForm(false)}
        />
      </Box>
    )
  }

  if (!goal) return null

  const progress = goal.progressPercent
  const isAchieved = goal.status === 'ACHIEVED'
  const label = TARGET_TYPE_LABELS[goal.targetType]
  const remaining = Math.max(0, goal.targetValue - Math.round((progress / 100) * goal.targetValue))
  const goalHeaderLabel = `${GOAL_PREFIX} ${label}`
  const remainingLabel = `${remaining} ${TO_GO_LABEL}`
  const progressLabel = `${progress}${PCT_SUFFIX}`
  const targetLabel = `${goal.targetValue} ${goal.targetType === 'STREAK' ? 'days' : 'completions'}`

  return (
    <Box sx={{ pt: 1 }}>
      <Divider sx={{ mb: 1.5 }} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
          {goalHeaderLabel}
        </Typography>
        {isAchieved ? (
          <Chip
            icon={<EmojiEventsIcon sx={{ fontSize: 14 }} />}
            label={ACHIEVED_LABEL}
            size="small"
            color="success"
            sx={{ fontWeight: 700 }}
          />
        ) : (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {remainingLabel}
          </Typography>
        )}
      </Box>

      <Box sx={{ position: 'relative', height: 8 }}>
        <LinearProgress
          variant="determinate"
          value={Math.min(100, progress)}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              bgcolor: isAchieved
                ? 'success.main'
                : progress >= 80
                  ? 'warning.main'
                  : 'primary.main',
              borderRadius: 4,
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: -2,
            left: '80%',
            width: 2,
            height: 12,
            bgcolor: 'warning.main',
            opacity: 0.6,
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {progressLabel}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {targetLabel}
        </Typography>
      </Box>
    </Box>
  )
}
