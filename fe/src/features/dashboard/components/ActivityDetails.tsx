import React from 'react'
import { Box, Typography } from '@/components/ui'
import { pxToRem } from '@/utils'

const LABEL_COMPLETED = 'Completed: '
const LABEL_HABITS = ' habits'
const LABEL_NO_HABITS = 'No habits completed on this day.'
const LABEL_CLICK_INSTRUCTION = 'Click any cell to view check-in activity for that date.'

export interface TaskDetail {
  name: string
  category: string
  completedCount: number
  targetPerDay: number
}

export interface ActivityDetailsProps {
  details: {
    date: string
    count: number
    tasks: TaskDetail[]
  } | null
}

export const ActivityDetails: React.FC<ActivityDetailsProps> = ({ details }) => {
  if (!details) {
    return (
      <Box
        sx={{
          p: 2,
          borderRadius: 1,
          bgcolor: 'background.default',
          border: '1px dashed',
          borderColor: 'divider',
          textAlign: 'center',
          color: 'text.secondary',
          py: 4,
        }}
      >
        <Typography variant="body2">{LABEL_CLICK_INSTRUCTION}</Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 1,
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
        {details.date}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {LABEL_COMPLETED}
        <strong>{details.count}</strong>
        {LABEL_HABITS}
      </Typography>
      {details.tasks.length === 0 ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', fontStyle: 'italic' }}
        >
          {LABEL_NO_HABITS}
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            maxHeight: pxToRem(220),
            overflowY: 'auto',
            pr: 0.5,
            '&::-webkit-scrollbar': { width: 4 },
            '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'divider',
              borderRadius: 2,
            },
          }}
        >
          {details.tasks.map((task) => {
            const ratioText = `${task.completedCount}/${task.targetPerDay}`
            return (
              <Box
                key={`${task.name}-${task.category}`}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  bgcolor: 'background.paper',
                  p: 1.25,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {task.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {task.category}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700, pl: 1, color: 'success.main' }}>
                  {ratioText}
                </Typography>
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  )
}
