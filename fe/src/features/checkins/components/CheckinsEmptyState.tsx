import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { pxToRem } from '@/utils'
import { CHECKIN_CONTENT } from '../constants'

const NAVIGATE_HABITS = '/habits'

export const CheckinsEmptyState: React.FC<{ hasHabits: boolean }> = ({ hasHabits }) => {
  const navigate = useNavigate()

  if (hasHabits) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, gap: 1.5 }}>
        <Box
          sx={{
            width: pxToRem(52),
            height: pxToRem(52),
            borderRadius: '50%',
            bgcolor: 'action.hover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icons.Check sx={{ color: 'text.disabled', fontSize: pxToRem(26) }} />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {CHECKIN_CONTENT.PLACEHOLDERS.NO_HABITS_SCHEDULED}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, gap: 1.5 }}>
      <Typography variant="body2" color="text.secondary">
        {CHECKIN_CONTENT.PLACEHOLDERS.NO_HABITS_TITLE}
      </Typography>
      <Box
        role="button"
        onClick={() => navigate(NAVIGATE_HABITS)}
        sx={{
          width: pxToRem(56),
          height: pxToRem(56),
          borderRadius: '50%',
          bgcolor: 'success.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'opacity 0.2s, transform 0.2s',
          '&:hover': { opacity: 0.85, transform: 'scale(1.05)' },
        }}
      >
        <Icons.Add sx={{ color: 'common.white', fontSize: pxToRem(28) }} />
      </Box>
      <Typography variant="caption" color="text.secondary">
        {CHECKIN_CONTENT.PLACEHOLDERS.NO_HABITS_CTA}
      </Typography>
    </Box>
  )
}
