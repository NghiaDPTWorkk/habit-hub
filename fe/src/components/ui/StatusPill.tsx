import React from 'react'
import Chip from '@mui/material/Chip'
import type { ChipProps } from '@mui/material/Chip'

const LABEL_ACTIVE = 'Active'
const LABEL_PAUSED = 'Paused'
const LABEL_ARCHIVED = 'Archived'
const CHIP_SIZE_SMALL = 'small'
const COLOR_SUCCESS = 'success'
const COLOR_WARNING = 'warning'
const COLOR_SECONDARY = 'secondary'
const COLOR_DEFAULT = 'default'

export interface StatusPillProps extends ChipProps {
  status?: 'active' | 'paused' | 'archived'
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, color, label, ...props }) => {
  let pillColor: ChipProps['color'] = COLOR_DEFAULT
  let pillLabel = label

  if (status === 'active') {
    pillColor = COLOR_SUCCESS
    pillLabel = LABEL_ACTIVE
  } else if (status === 'paused') {
    pillColor = COLOR_WARNING
    pillLabel = LABEL_PAUSED
  } else if (status === 'archived') {
    pillColor = COLOR_SECONDARY
    pillLabel = LABEL_ARCHIVED
  }

  return (
    <Chip
      size={CHIP_SIZE_SMALL}
      color={status ? pillColor : color}
      label={status ? pillLabel : label}
      {...props}
    />
  )
}

export default StatusPill
