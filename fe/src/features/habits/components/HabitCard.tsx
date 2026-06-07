import { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Checkbox from '@mui/material/Checkbox'
import Tooltip from '@mui/material/Tooltip'
import { CheckIcon, AddIcon, WarningAmberIcon } from '@/components/ui/icons'
import type { Habit } from '@/types'
import { CATEGORY_LABELS, FREQUENCY_LABELS, PRIORITY_LABELS, STATUS_LABELS } from '@/types'
import { CATEGORY_COLORS, CATEGORY_BG, PRIORITY_COLORS, STATUS_COLORS } from '@/theme'
import { upsertCheckIn } from '@/services/CheckInsService'
import { getActiveGoal } from '@/services/GoalsService'
import { useBoundStore } from '@/store/useBoundStore'
import { today, isToday } from '@/utils/dateUtils'
import { isScheduledOn } from '@/services/ScheduleService'
import { useToast } from '@/hooks/useToast'
import { AppError } from '@/domain/AppError'
import { HabitOverflowMenu } from './HabitOverflowMenu'
import { GoalPanel } from '@/features/goals/components/GoalPanel'
import { MultiCountModal } from '@/features/checkins/components/MultiCountModal'

const PROGRESS_LABEL = "Today's progress"
const NOT_SCHEDULED_LABEL = 'Not scheduled today'
const MARK_DONE_LABEL = 'Mark done'
const MARK_INCOMPLETE_LABEL = 'Mark incomplete'
const LOG_PROGRESS_LABEL = 'Log progress'
const AT_RISK_LABEL = 'At risk'

interface Props {
  habit: Habit
  isAtRisk: boolean
  onEdit: () => void
}

export function HabitCard({ habit, isAtRisk, onEdit }: Props) {
  const toast = useToast()
  const t = today()

  const checkInToday = useBoundStore((s) =>
    s.checkIns.find((c) => c.habitId === habit.id && c.date === t)
  )
  const goalData = useBoundStore((s) => {
    const goals = s.goals
    const active = goals.find((g) => g.habitId === habit.id && g.status === 'ACTIVE')
    return active ?? null
  })

  const [optimisticDone, setOptimisticDone] = useState<boolean | null>(null)
  const [multiCountOpen, setMultiCountOpen] = useState(false)

  const scheduledToday = isScheduledOn(habit, t)
  const completedCount = checkInToday?.completedCount ?? 0
  const isDone = optimisticDone ?? completedCount >= habit.targetPerDay
  const progress =
    habit.targetPerDay === 1 ? (isDone ? 100 : 0) : (completedCount / habit.targetPerDay) * 100

  const activeGoal = goalData ? getActiveGoal(habit.id) : null

  async function handleQuickToggle(checked: boolean) {
    const prev = optimisticDone
    setOptimisticDone(checked)
    try {
      const prevThreshold = activeGoal?.lastThresholdNotified
      upsertCheckIn({
        habitId: habit.id,
        date: t,
        completedCount: checked ? 1 : 0,
      })
      const newGoal = getActiveGoal(habit.id)
      if (newGoal && prevThreshold !== newGoal.lastThresholdNotified) {
        if (newGoal.lastThresholdNotified === 'ONE_HUNDRED') {
          toast.success('Goal achieved! 🎯')
        } else if (newGoal.lastThresholdNotified === 'EIGHTY') {
          toast.info('Almost there — keep going!')
        }
      }
    } catch (err) {
      setOptimisticDone(prev)
      toast.error(err instanceof AppError ? err.message : 'Check-in failed')
    }
  }

  const statusColor = STATUS_COLORS[habit.status]
  const categoryColor = CATEGORY_COLORS[habit.category]
  const countLabel =
    habit.targetPerDay === 1
      ? isDone
        ? 'Done'
        : 'Not done'
      : `${completedCount} / ${habit.targetPerDay}`

  return (
    <>
      <Card
        sx={{
          borderLeft: `4px solid ${categoryColor}`,
          ...(isAtRisk && {
            borderColor: 'warning.main',
            borderWidth: 2,
          }),
          transition: 'box-shadow 0.15s',
          '&:hover': { boxShadow: 3 },
        }}
      >
        <CardContent sx={{ pb: '12px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }} noWrap title={habit.name}>
                {habit.name}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                <Chip
                  label={CATEGORY_LABELS[habit.category]}
                  size="small"
                  sx={{
                    bgcolor: CATEGORY_BG[habit.category],
                    color: categoryColor,
                    fontWeight: 600,
                    fontSize: 11,
                  }}
                />
                <Chip
                  label={FREQUENCY_LABELS[habit.frequencyType]}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: 11 }}
                />
                <Chip
                  label={PRIORITY_LABELS[habit.priority]}
                  size="small"
                  sx={{
                    bgcolor: `${PRIORITY_COLORS[habit.priority]}18`,
                    color: PRIORITY_COLORS[habit.priority],
                    fontWeight: 600,
                    fontSize: 11,
                  }}
                />
                <Chip
                  label={STATUS_LABELS[habit.status]}
                  size="small"
                  sx={{
                    bgcolor: `${statusColor}18`,
                    color: statusColor,
                    fontWeight: 600,
                    fontSize: 11,
                  }}
                />
                {isAtRisk && (
                  <Chip
                    icon={<WarningAmberIcon sx={{ fontSize: '14px !important' }} />}
                    label={AT_RISK_LABEL}
                    size="small"
                    color="warning"
                    sx={{ fontWeight: 600, fontSize: 11 }}
                  />
                )}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
              {scheduledToday &&
                isToday(t) &&
                (habit.targetPerDay === 1 ? (
                  <Tooltip title={isDone ? MARK_INCOMPLETE_LABEL : MARK_DONE_LABEL}>
                    <Checkbox
                      checked={isDone}
                      onChange={(e) => handleQuickToggle(e.target.checked)}
                      icon={
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            border: '2px solid',
                            borderColor: 'grey.400',
                            borderRadius: '50%',
                          }}
                        />
                      }
                      checkedIcon={
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: 'primary.main',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <CheckIcon sx={{ fontSize: 14, color: 'white' }} />
                        </Box>
                      }
                      size="small"
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title={LOG_PROGRESS_LABEL}>
                    <IconButton size="small" onClick={() => setMultiCountOpen(true)}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                ))}
              <HabitOverflowMenu habit={habit} onEdit={onEdit} />
            </Box>
          </Box>

          {scheduledToday && (
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {PROGRESS_LABEL}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  {countLabel}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, progress)}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: isDone ? 'success.main' : 'primary.main',
                    borderRadius: 3,
                  },
                }}
              />
            </Box>
          )}
          {!scheduledToday && (
            <Typography variant="caption" color="text.secondary">
              {NOT_SCHEDULED_LABEL}
            </Typography>
          )}

          <GoalPanel habitId={habit.id} goal={activeGoal} />
        </CardContent>
      </Card>

      <MultiCountModal
        key={multiCountOpen ? `open-${habit.id}` : 'closed'}
        open={multiCountOpen}
        habit={habit}
        currentCount={completedCount}
        onClose={() => setMultiCountOpen(false)}
      />
    </>
  )
}
