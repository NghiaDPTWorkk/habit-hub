import React from 'react'
import { Box, Typography, Card } from '@/components/ui'
import { Button } from '@/components/ui'
import { ProgressBar } from '@/components/ui'
import type { Habit, Checkin } from '@/types'
import { QuickToggle } from './QuickToggle'

const LABEL_UPDATE_PROGRESS = 'Update Progress'
const VARIANT_H6 = 'h6'
const VARIANT_BODY2 = 'body2'
const VARIANT_CAPTION = 'caption'
const VARIANT_CONTAINED = 'contained'
const COLOR_TEXT_SECONDARY = 'text.secondary'
const COLOR_SUCCESS = 'success'
const TARGET_PER_DAY_YESNO = 1

export interface CheckinItemCardProps {
  habit: Habit
  checkin: Checkin | undefined
  today: string
  onOpenModal: () => void
}

export const CheckinItemCard: React.FC<CheckinItemCardProps> = ({
  habit,
  checkin,
  today,
  onOpenModal,
}) => {
  const completedCount = checkin?.completedCount ?? 0
  const isYesNo = habit.targetPerDay === TARGET_PER_DAY_YESNO
  const isChecked = checkin?.status === 'Completed'
  const progressValue = Math.round((completedCount / habit.targetPerDay) * 100)
  const countLabel = `${completedCount} / ${habit.targetPerDay}`

  return (
    <Card sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant={VARIANT_H6}>{habit.name}</Typography>
          <Typography variant={VARIANT_BODY2} color={COLOR_TEXT_SECONDARY}>
            {habit.category}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isYesNo ? (
            <QuickToggle habitId={habit.id} date={today} checked={isChecked} />
          ) : (
            <>
              <Typography variant={VARIANT_CAPTION} color={COLOR_TEXT_SECONDARY}>
                {countLabel}
              </Typography>
              <Button variant={VARIANT_CONTAINED} color={COLOR_SUCCESS} onClick={onOpenModal}>
                {LABEL_UPDATE_PROGRESS}
              </Button>
            </>
          )}
        </Box>
      </Box>

      {!isYesNo && (
        <Box sx={{ mt: 2 }}>
          <ProgressBar value={progressValue} color={COLOR_SUCCESS} />
        </Box>
      )}
    </Card>
  )
}
