import React from 'react'
import { Box, Card, Typography } from '@/components/ui'
import { ProgressBar } from '@/components/ui'
import { CHECKIN_STATUS_LABEL } from '../constants'
import type { MockCheckinRecord } from '../mock'
import type { CheckinStatus } from '@/types'

const VARIANT_SUBTITLE1 = 'subtitle1'
const VARIANT_BODY2 = 'body2'
const VARIANT_CAPTION = 'caption'
const COLOR_TEXT_SECONDARY = 'text.secondary'

const STATUS_TEXT_COLOR: Record<CheckinStatus, string> = {
  Completed: 'success.main',
  'In Progress': 'warning.main',
  'Not Started': 'text.disabled',
}

const STATUS_PROGRESS_COLOR: Record<CheckinStatus, 'success' | 'warning' | 'primary'> = {
  Completed: 'success',
  'In Progress': 'warning',
  'Not Started': 'primary',
}

export type CheckinHistoryCardProps = Omit<MockCheckinRecord, 'id'>

export const CheckinHistoryCard: React.FC<CheckinHistoryCardProps> = ({
  habitName,
  category,
  targetPerDay,
  completedCount,
  status,
}) => {
  const progressValue = Math.round((completedCount / targetPerDay) * 100)
  const progressLabel = `${completedCount} / ${targetPerDay}`

  return (
    <Card sx={{ p: 2 }}>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}
      >
        <Box>
          <Typography variant={VARIANT_SUBTITLE1} sx={{ fontWeight: 600 }}>
            {habitName}
          </Typography>
          <Typography variant={VARIANT_BODY2} color={COLOR_TEXT_SECONDARY}>
            {category}
          </Typography>
        </Box>
        <Typography
          variant={VARIANT_CAPTION}
          sx={{ fontWeight: 600 }}
          color={STATUS_TEXT_COLOR[status]}
        >
          {CHECKIN_STATUS_LABEL[status]}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <ProgressBar value={progressValue} color={STATUS_PROGRESS_COLOR[status]} />
        </Box>
        <Typography variant={VARIANT_CAPTION} color={COLOR_TEXT_SECONDARY}>
          {progressLabel}
        </Typography>
      </Box>
    </Card>
  )
}
