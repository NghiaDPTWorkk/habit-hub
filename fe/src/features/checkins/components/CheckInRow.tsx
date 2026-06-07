import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { AddIcon } from '@/components/ui/icons'
import type { CheckIn, Habit } from '@/types'
import { COMPLETION_STATUS_LABELS } from '@/types'
import { COMPLETION_COLORS } from '@/theme'
import { upsertCheckIn } from '@/services/CheckInsService'
import { useToast } from '@/hooks/useToast'
import { AppError } from '@/domain/AppError'
import { MultiCountModal } from './MultiCountModal'
import { today } from '@/utils/dateUtils'

const MARK_DONE = 'Mark done'
const LOG_PROGRESS = 'Log progress'

interface Props {
  checkIn: CheckIn
  habit: Habit
  date: string
  readOnly?: boolean
}

export function CheckInRow({ checkIn, habit, date, readOnly }: Props) {
  const toast = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const isToday = date === today()

  const statusColor = COMPLETION_COLORS[checkIn.completionStatus]
  const progress =
    habit.targetPerDay === 1
      ? checkIn.completionStatus === 'COMPLETED'
        ? 100
        : 0
      : (checkIn.completedCount / habit.targetPerDay) * 100

  const countLabel = `${checkIn.completedCount}/${habit.targetPerDay}`

  function handleQuickDone() {
    try {
      upsertCheckIn({ habitId: habit.id, date, completedCount: 1 })
    } catch (err) {
      toast.error(err instanceof AppError ? err.message : 'Check-in failed')
    }
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          '&:last-child': { borderBottom: 'none' },
        }}
      >
        <Typography variant="body2" noWrap sx={{ fontWeight: 600, flexGrow: 1, minWidth: 0 }}>
          {habit.name}
        </Typography>

        <Box sx={{ width: 80, flexShrink: 0 }}>
          <LinearProgress
            variant="determinate"
            value={Math.min(100, progress)}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': { bgcolor: statusColor, borderRadius: 3 },
            }}
          />
        </Box>

        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', width: 40, textAlign: 'right', flexShrink: 0 }}
        >
          {countLabel}
        </Typography>

        <Chip
          label={COMPLETION_STATUS_LABELS[checkIn.completionStatus]}
          size="small"
          sx={{
            bgcolor: `${statusColor}18`,
            color: statusColor,
            fontWeight: 600,
            fontSize: 11,
            flexShrink: 0,
          }}
        />

        {!readOnly && isToday && checkIn.completionStatus !== 'COMPLETED' && (
          <Tooltip title={habit.targetPerDay === 1 ? MARK_DONE : LOG_PROGRESS}>
            <IconButton
              size="small"
              onClick={habit.targetPerDay === 1 ? handleQuickDone : () => setModalOpen(true)}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {habit.targetPerDay > 1 && (
        <MultiCountModal
          key={modalOpen ? `open-${habit.id}` : 'closed'}
          open={modalOpen}
          habit={habit}
          currentCount={checkIn.completedCount}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}
